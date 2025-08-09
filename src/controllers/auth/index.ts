import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../environment';
import { googleAuthService } from '../../services/googleAuth';
import { JwtPayload } from '../../types/jwtPayload.interface';
import { LoginResponse, LoginWithGoogleRequestBody } from './types';
import { usersService } from '../../services/users';
import { ApiRequestWithBody, ApiResponse } from '../../interfaces/ApiResponse';

const loginWithGoogle = async (
  req: ApiRequestWithBody<LoginWithGoogleRequestBody>,
  res: ApiResponse<LoginResponse>
) => {
  const { idToken: googleIdToken } = req.body;

  if (!googleIdToken) {
    return res
      .status(400)
      .json({ success: false, message: 'idToken is required.' });
  }

  const payload = await googleAuthService.verifyIdToken(googleIdToken);

  if (!payload) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid idToken.' });
  }

  let tokenPayload: JwtPayload;

  const user = await usersService.findByEmail(payload.email);
  if (user) {
    tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  } else {
    const newUser = await usersService.create({
      googleId: payload.googleId,
      email: payload.email,
      username: payload.name,
    });

    tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
  }

  const token = jwt.sign(tokenPayload, env.JWT_SECRET);

  return res.json({ success: true, token });
};

const admLogin = async (req: Request, res: ApiResponse<LoginResponse>) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .send({ success: false, message: 'No token provided.' });
  }

  const authHeaderParts = authHeader.split(' ');
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Basic') {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid authorization header.' });
  }

  const credentials = Buffer.from(authHeaderParts[1], 'base64').toString(
    'ascii'
  );

  if (credentials !== env.ADMIN_SECRET) {
    return res.status(400).send({ success: false, message: 'Invalid token.' });
  }

  const token = jwt.sign(
    {},
    env.ADM_JWT_SECRET,
    env.IS_DEVELOPMENT ? undefined : { expiresIn: '8h' }
  );

  return res.json({ success: true, token });
};

export const authController = {
  loginWithGoogle,
  admLogin,
};
