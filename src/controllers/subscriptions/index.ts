import { ApiResponse } from '../../interfaces/ApiResponse';
import { paymentsService } from '../../services/payments';
import { Subscription } from '../../models/subscription';
import { Request } from 'express';

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

export const subscriptionsController = {
  getActiveSubscriptions,
};
