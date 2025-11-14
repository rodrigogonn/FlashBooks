import mongoose from 'mongoose';
import { env } from '../environment';
import { BookModel } from '../models/book';
import { UserModel } from '../models/user';
import { DlqEventModel } from '../models/dlqEvents';
import { SubscriptionModel } from '../models/subscription';
import { SubscriptionEventModel } from '../models/subscriptionEvent';

const connect = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    await UserModel.createIndexes();
    await BookModel.createIndexes();
    await DlqEventModel.createIndexes();
    await SubscriptionModel.createIndexes();
    await SubscriptionEventModel.createIndexes();
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
};

export const database = {
  connect,
};
