import { androidpublisher_v3, google } from 'googleapis';
import {
  SubscriptionModel,
  SubscriptionStatus,
} from '../../models/subscription';
import { SubscriptionEventModel } from '../../models/subscriptionEvent';
import { env } from '../../environment';
import {
  RealTimeDeveloperNotification,
  SubscriptionNotificationType,
} from './types/RTDN.types';
import { Types } from 'mongoose';

const authClient = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  keyFile: env.googleCloud.GOOGLE_APPLICATION_CREDENTIALS,
});
const androidPublisher = google.androidpublisher({
  version: 'v3',
  auth: authClient,
});

const getUserSubscriptions = async (userId: string) => {
  return SubscriptionModel.find({
    userId,
    status: {
      $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE_PERIOD],
    },
    expiryTime: { $gt: new Date() },
  });
};

const getSubscriptionByPurchaseToken = async (purchaseToken: string) => {
  return SubscriptionModel.findOne({ purchaseToken });
};

const processPaymentEvent = async (event: RealTimeDeveloperNotification) => {
  if (event.subscriptionNotification) {
    return processSubscriptionEvent(event);
  }

  if (event.voidedPurchaseNotification) {
    return processVoidedPurchase(event);
  }

  throw new Error('Evento desconhecido recebido');
};

const processSubscriptionEvent = async (
  event: RealTimeDeveloperNotification
) => {
  const { subscriptionNotification } = event;
  const { purchaseToken, notificationType, subscriptionId } =
    subscriptionNotification!;
  const eventTime = new Date(parseInt(event.eventTimeMillis, 10));

  const alreadyProcessed = await SubscriptionEventModel.findOne({
    subscriptionId,
    eventTime,
  });

  if (alreadyProcessed) {
    console.log(
      `Evento ${notificationType} para ${purchaseToken} já foi processado.`
    );
    return;
  }

  const subscription = await SubscriptionModel.findOneAndUpdate(
    { purchaseToken },
    {
      $set: {
        packageName: event.packageName,
        productId: subscriptionId,
        purchaseToken,
        status: mapSubscriptionStatus(notificationType),
        startTime: eventTime,
        expiryTime: eventTime,
      },
      $setOnInsert: {
        userId: null,
      },
    },
    { upsert: true, new: true } // 🔹 Cria a assinatura se não existir
  );

  await SubscriptionEventModel.create({
    subscriptionId: subscription._id,
    notificationType,
    eventTime,
    rawEventData: event,
  });

  if (
    [
      SubscriptionNotificationType.SUBSCRIPTION_CANCELED,
      SubscriptionNotificationType.SUBSCRIPTION_REVOKED,
      SubscriptionNotificationType.SUBSCRIPTION_EXPIRED,
    ].includes(notificationType)
  ) {
    await syncSubscriptionWithPlayStore(
      event.packageName,
      subscription.productId,
      purchaseToken
    );
  }
};

const processVoidedPurchase = async (event: RealTimeDeveloperNotification) => {
  const { voidedPurchaseNotification } = event;
  const { purchaseToken } = voidedPurchaseNotification!;
  const eventTime = new Date(parseInt(event.eventTimeMillis, 10));

  const subscription = await SubscriptionModel.findOne({ purchaseToken });

  if (subscription) {
    console.log(`Assinatura ${subscription.productId} foi revogada.`);
    subscription.status = SubscriptionStatus.REVOKED;
    await subscription.save();
  }

  await SubscriptionEventModel.create({
    subscriptionId: subscription?._id,
    notificationType: 999, // Código fictício para "Voided Purchase"
    eventTime,
    rawEventData: event,
  });
};

const determineSubscriptionStatus = (
  data: androidpublisher_v3.Schema$SubscriptionPurchase
): SubscriptionStatus => {
  const now = new Date();
  const expiryTime = new Date(parseInt(data.expiryTimeMillis || '0', 10));

  if (data.cancelReason !== undefined) {
    return SubscriptionStatus.CANCELED;
  }

  if (expiryTime < now) {
    return SubscriptionStatus.EXPIRED;
  }

  if (data.paymentState === 0) {
    return SubscriptionStatus.ON_HOLD;
  }

  if (data.paymentState === 1) {
    return SubscriptionStatus.ACTIVE;
  }

  if (data.paymentState === 2) {
    return SubscriptionStatus.GRACE_PERIOD;
  }

  if (data.paymentState === 3) {
    return SubscriptionStatus.PAUSED;
  }

  return SubscriptionStatus.ACTIVE;
};

const syncSubscriptionWithPlayStore = async (
  packageName: string,
  subscriptionId: string,
  purchaseToken: string
) => {
  try {
    const response = await androidPublisher.purchases.subscriptions.get({
      packageName,
      subscriptionId,
      token: purchaseToken,
    });

    const data = response.data;
    console.log('Dados da API do Google Play:', data);

    await SubscriptionModel.findOneAndUpdate(
      { purchaseToken },
      {
        startTime: new Date(parseInt(data.startTimeMillis || '0', 10)),
        expiryTime: new Date(parseInt(data.expiryTimeMillis || '0', 10)),
        status: determineSubscriptionStatus(data),
      }
    );

    console.log(`Assinatura ${purchaseToken} sincronizada com sucesso.`);
  } catch (error) {
    console.error(`Erro ao sincronizar assinatura ${purchaseToken}:`, error);
  }
};

const mapSubscriptionStatus = (
  notificationType: number
): SubscriptionStatus => {
  switch (notificationType) {
    case SubscriptionNotificationType.SUBSCRIPTION_RECOVERED:
      return SubscriptionStatus.ACTIVE;
    case SubscriptionNotificationType.SUBSCRIPTION_RENEWED:
      return SubscriptionStatus.ACTIVE;
    case SubscriptionNotificationType.SUBSCRIPTION_CANCELED:
      return SubscriptionStatus.CANCELED;
    case SubscriptionNotificationType.SUBSCRIPTION_PURCHASED:
      return SubscriptionStatus.ACTIVE;
    case SubscriptionNotificationType.SUBSCRIPTION_ON_HOLD:
      return SubscriptionStatus.ON_HOLD;
    case SubscriptionNotificationType.SUBSCRIPTION_IN_GRACE_PERIOD:
      return SubscriptionStatus.GRACE_PERIOD;
    case SubscriptionNotificationType.SUBSCRIPTION_RESTARTED:
      return SubscriptionStatus.ACTIVE;
    case SubscriptionNotificationType.SUBSCRIPTION_REVOKED:
      return SubscriptionStatus.REVOKED;
    case SubscriptionNotificationType.SUBSCRIPTION_EXPIRED:
      return SubscriptionStatus.EXPIRED;
    default:
      console.warn(`Tipo de notificação desconhecido: ${notificationType}`);
      return SubscriptionStatus.ACTIVE;
  }
};

const linkSubscriptionToUser = async (
  userId: Types.ObjectId,
  purchaseToken: string
) => {
  const subscription = await SubscriptionModel.findOne({ purchaseToken });

  if (!subscription) {
    console.warn(`Nenhuma assinatura encontrada para o token ${purchaseToken}`);
    return null;
  }

  if (!subscription.userId) {
    subscription.userId = userId;
    await subscription.save();
    console.log(
      `Assinatura ${subscription.productId} vinculada ao usuário ${userId}`
    );
  } else {
    console.warn(
      `Assinatura ${subscription.productId} já está vinculada a um usuário.`
    );
  }

  return subscription;
};

export const paymentsService = {
  getUserSubscriptions,
  getSubscriptionByPurchaseToken,
  processPaymentEvent,
  syncSubscriptionWithPlayStore,
  linkSubscriptionToUser,
};
