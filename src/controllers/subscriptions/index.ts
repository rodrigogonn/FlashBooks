import { ApiRequestWithBody, ApiResponse } from '../../interfaces/ApiResponse';
import { paymentsService } from '../../services/payments';
import { Subscription } from '../../models/subscription';
import { Request } from 'express';
import { verifyPurchaseSchema } from './validation';

const getActiveSubscriptions = async (
  req: Request,
  res: ApiResponse<{ subscriptions: Subscription[] }>
) => {
  const userId = req.userId!;

  const activeSubscriptions = await paymentsService.getUserActiveSubscriptions(
    userId
  );

  return res.status(200).json({
    success: true,
    subscriptions: activeSubscriptions,
  });
};

const verifyPurchase = async (
  req: ApiRequestWithBody<{ purchaseToken: string }>,
  res: ApiResponse<{ subscription: Subscription }>
) => {
  const userId = req.userId!;

  const validatedData = verifyPurchaseSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: validatedData.error,
    });
  }

  const { purchaseToken, packageName, productId } = validatedData.data;

  const subscription = await paymentsService.verifyPurchase({
    userId,
    purchaseToken,
    packageName,
    productId,
  });

  return res.status(200).json({
    success: true,
    subscription,
  });
};

export const subscriptionsController = {
  getActiveSubscriptions,
  verifyPurchase,
};
