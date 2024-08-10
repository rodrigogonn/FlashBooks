import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../environment';
import { googleAuthService } from '../../services/googleAuth';
import { JwtPayload } from '../../types/jwtPayload.interface';
import { LoginResponse, LoginWithGoogleRequestBody } from './types';
import { usersService } from '../../services/users';

const loginWithGoogle = async (
  req: Request<{}, {}, LoginWithGoogleRequestBody>,
  res: Response<LoginResponse>
) => {
  const { idToken: googleIdToken } = req.body;

  if (!googleIdToken) {
    return res.status(400).json({ message: 'idToken is required.' });
  }

  const payload = await googleAuthService.verifyIdToken(googleIdToken);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid idToken.' });
  }

  let tokenPayload: JwtPayload;

  const user = await usersService.findByEmail(payload.email);
  if (user) {
    console.log('user', user);

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

    console.log('newUser', newUser);

    tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
  }

  // @TODO adicionar expiração do token
  const token = jwt.sign(tokenPayload, env.JWT_SECRET);

  return res.json({ token });
};

export const authController = {
  loginWithGoogle,
};
