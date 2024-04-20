export const env = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  ADMIN_SECRET: process.env.ADMIN_SECRET || '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  MONGODB_URI: process.env.MONGODB_URI || '',
};
