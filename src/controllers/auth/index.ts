import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../environment';
import { User } from '../../models/user';
import { googleAuthService } from '../../services/googleAuth';
import { JwtPayload } from '../../types/jwtPayload.interface';
import { LoginResponse, LoginWithGoogleRequestBody } from './types';

const loginWithGoogle = async (
  req: Request<{}, {}, LoginWithGoogleRequestBody>,
  res: Response<LoginResponse>
) => {
  const { idToken: googleIdToken } = req.body;

  console.log('googleIdToken', googleIdToken);

  if (!googleIdToken) {
    return res.status(400).json({ message: 'idToken is required.' });
  }

  const payload = await googleAuthService.verifyIdToken(googleIdToken);

  if (payload) {
    return res.json({ message: JSON.stringify(payload) });
  }

  console.log('payload', payload);

  const email = '',
    password = '';

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // @TODO melhorar isso aqui com bcrypt
  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const tokenPayload: JwtPayload = {
    userId: user.id,
  };
  // @TODO adicionar expiração do token
  const token = jwt.sign(tokenPayload, env.JWT_SECRET);

  return res.json({ token });
};

export const authController = {
  loginWithGoogle,
};
