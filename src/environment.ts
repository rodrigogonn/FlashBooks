export const env = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
