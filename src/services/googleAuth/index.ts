import { OAuth2Client } from 'google-auth-library';
import { env } from '../../environment';

const client = new OAuth2Client(env.GOOGLE_WEB_CLIENT_ID);

const verifyIdToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) return null;

    return {
      googleId: payload.sub,
      email: payload.email || '',
      name: payload.name || '',
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export const googleAuthService = {
  verifyIdToken,
};
