import { NextFunction, Request, Response } from 'express';
import { env } from '../../environment';
import { ErrorResponse } from '../../interfaces/ErrorResponse';
import { OAuth2Client } from 'google-auth-library';
import path from 'path';

const serviceAccount: {
  client_email: string;
} = require(path.resolve(
  process.cwd(),
  env.googleCloud.GOOGLE_APPLICATION_CREDENTIALS
));

const client = new OAuth2Client();

export const googleAuth = async (
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
    const ticket = await client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid payload');
    }

    if (
      payload.email !== serviceAccount.client_email ||
      !payload.email_verified
    ) {
      throw new Error('Invalid payload email');
    }

    return next();
  } catch (error) {
    console.error('[googleAuth] error', error);
    return res.status(401).send({ success: false, message: 'Invalid token.' });
  }
};
