import { androidpublisher_v3, google } from 'googleapis';
import {
  SubscriptionModel,
  SubscriptionStatus,
} from '../../models/subscription';
import { SubscriptionEventModel } from '../../models/subscriptionEvent';
import { env } from '../../environment';
import { RealTimeDeveloperNotification } from './types/RTDN.types';
import { usersService } from '../users';

const authClient = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  credentials: env.googleCloud.GOOGLE_APPLICATION_CREDENTIALS,
});
const androidPublisher = google.androidpublisher({
  version: 'v3',
  auth: authClient,
});

const getUserActiveSubscriptions = async (userId: string) => {
  return SubscriptionModel.find({
    userId,
    status: SubscriptionStatus.ACTIVE,
    expiryTime: { $gt: new Date() },
  });
};

const getSubscriptionByPurchaseToken = async (purchaseToken: string) => {
  return SubscriptionModel.findOne({ purchaseToken });
};

const processPaymentEvent = async (event: RealTimeDeveloperNotification) => {
  console.log('[processPaymentEvent]', event);

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
  const { subscriptionNotification, packageName } = event;
  const { purchaseToken, notificationType, subscriptionId } =
    subscriptionNotification!;
  const eventTime = new Date(parseInt(event.eventTimeMillis, 10));

  const { data } = await androidPublisher.purchases.subscriptions.get({
    packageName,
    subscriptionId,
    token: purchaseToken,
  });
  const { purchaseType, emailAddress } = data;

  const isTestEvent = purchaseType === 1;

  if (
    (env.IS_PRODUCTION && isTestEvent) ||
    (!env.IS_PRODUCTION && !isTestEvent)
  ) {
    return;
  }

  let userId: string | null = null;

  if (emailAddress) {
    const user = await usersService.findByEmail(emailAddress);
    userId = user?.id;
  }

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
        startTime: new Date(parseInt(data.startTimeMillis || '0', 10)),
        expiryTime: new Date(parseInt(data.expiryTimeMillis || '0', 10)),
        status: determineSubscriptionStatus(data),
      },
      $setOnInsert: {
        userId,
      },
    },
    { upsert: true, new: true }
  );

  await SubscriptionEventModel.create({
    subscriptionId: subscription._id,
    notificationType,
    eventTime,
    rawEventData: event,
  });
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

    await SubscriptionEventModel.create({
      subscriptionId: subscription?._id,
      notificationType: 999, // Código fictício para "Voided Purchase"
      eventTime,
      rawEventData: event,
    });
  }
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

  switch (data.paymentState) {
    case 0:
      return SubscriptionStatus.ON_HOLD;
    case 1:
    case 2:
    case 3:
      return SubscriptionStatus.ACTIVE;
    default:
      return SubscriptionStatus.ACTIVE;
  }
};

export const paymentsService = {
  getUserActiveSubscriptions,
  getSubscriptionByPurchaseToken,
  processPaymentEvent,
};
