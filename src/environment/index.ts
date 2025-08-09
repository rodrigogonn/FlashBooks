const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'
);

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  ADM_JWT_SECRET: process.env.ADM_JWT_SECRET || '',
  ADMIN_SECRET: process.env.ADMIN_SECRET || '',
  IS_PRODUCTION: process.env.ENV === 'production',
  IS_STAGING: process.env.ENV === 'staging',
  IS_DEVELOPMENT: process.env.ENV === 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || '',
  firebase: {
    API_KEY: process.env.FIREBASE_API_KEY || '',
    AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
    MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    APP_ID: process.env.FIREBASE_APP_ID || '',
    MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
  googleCloud: {
    GOOGLE_APPLICATION_CREDENTIALS: {
      ...GOOGLE_APPLICATION_CREDENTIALS,
      private_key: GOOGLE_APPLICATION_CREDENTIALS.private_key.replace(
        /\\n/g,
        '\n'
      ),
    },
    pubSub: {
      payments: {
        TOPIC_NAME: process.env.GOOGLE_PUBSUB_PAYMENTS_TOPIC_NAME || '',
        SUBSCRIPTION_NAME:
          process.env.GOOGLE_PUBSUB_PAYMENTS_SUBSCRIPTION_NAME || '',
      },
      paymentsDlq: {
        SUBSCRIPTION_NAME:
          process.env.GOOGLE_PUBSUB_PAYMENTS_DLQ_SUBSCRIPTION_NAME || '',
      },
    },
  },
};
