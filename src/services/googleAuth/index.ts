const verifyIdToken = async (idToken: string) => {
  if (!idToken) {
    throw new Error('Invalid idToken');
  }

  return {
    googleId: '1234567890',
    email: 'rodrigo_gonn@hotmail.com',
    name: 'Rodrigo Gonçalves',
  };
};

export const googleAuthService = {
  verifyIdToken,
};
