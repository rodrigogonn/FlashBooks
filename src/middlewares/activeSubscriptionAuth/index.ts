import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../environment';
import { ErrorResponse } from '../../interfaces/ErrorResponse';
import { JwtPayload } from '../../types/jwtPayload.interface';
import { paymentsService } from '../../services/payments';

export const activeSubscriptionAuth = async (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .send({ success: false, message: 'No token provided.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res
      .status(401)
      .send({ success: false, message: 'Invalid authorization header.' });
  }

  const token = tokenParts[1];

  try {
    const { userId } = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.userId = userId;

    const activeSubscriptions =
      await paymentsService.getUserActiveSubscriptions(userId);

    if (!activeSubscriptions.length) {
      return res
        .status(401)
        .send({ success: false, message: 'No active subscription found.' });
    }

    return next();
  } catch {
    return res.status(401).send({ success: false, message: 'Invalid token.' });
  }
};
