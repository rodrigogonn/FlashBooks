import mongoose from 'mongoose';
import { env } from '../environment';
import { BookModel } from '../models/book';
import { UserModel } from '../models/user';
import { DlqEventModel } from '../models/dlqEvents';
import { SubscriptionModel } from '../models/subscription';
import { SubscriptionEventModel } from '../models/subscriptionEvent';

let connectPromise: Promise<void> | null = null;
let listenersAttached = false;

const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    console.log('[db] connected');
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('[db] reconnected');
  });
  mongoose.connection.on('error', (err: Error) => {
    console.error('[db] connection error:', err.message);
  });
};

const createIndexes = async () => {
  try {
    await Promise.all([
      UserModel.createIndexes(),
      BookModel.createIndexes(),
      DlqEventModel.createIndexes(),
      SubscriptionModel.createIndexes(),
      SubscriptionEventModel.createIndexes(),
    ]);
  } catch (err) {
    console.error('[db] failed to create indexes:', err);
  }
};

const connect = (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();

  if (!connectPromise) {
    attachListeners();
    console.log('[db] connecting...');

    connectPromise = (async () => {
      try {
        await mongoose.connect(env.MONGODB_URI, {
          serverSelectionTimeoutMS: 8000,
        });
        await createIndexes();
      } catch (err) {
        connectPromise = null;
        throw err;
      }
    })();
  }

  return connectPromise;
};

export const database = {
  connect,
};
