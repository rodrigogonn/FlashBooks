import { env } from '../../environment';
import { dlqEventsService } from '../../services/dlqEvents';
import { Request, Response } from 'express';
import { paymentsService } from '../../services/payments';

const payments = async (req: Request, res: Response) => {
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString(
      'utf-8'
    );

    const paymentEvent = JSON.parse(message);

    await paymentsService.processPaymentEvent(paymentEvent);

    return res.status(200).send();
  } catch (error) {
    console.error('Erro ao processar mensagem da assinatura', error);
    return res.status(500).send();
  }
};

const paymentsDLQ = async (req: Request, res: Response) => {
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString(
      'utf-8'
    );

    console.log(`Nova mensagem na DLQ payments: ${message}`);
    await dlqEventsService.create({
      topicName: env.googleCloud.pubSub.payments.TOPIC_NAME,
      message,
    });

    return res.status(200).send();
  } catch (error) {
    console.error('Erro ao processar mensagem da DLQ payments', error);
    return res.status(500).send();
  }
};

export const webhooksController = {
  payments,
  paymentsDLQ,
};
