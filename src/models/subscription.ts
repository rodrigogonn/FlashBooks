import { Schema, model } from 'mongoose';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  ON_HOLD = 'ON_HOLD',
  GRACE_PERIOD = 'GRACE_PERIOD',
  PAUSED = 'PAUSED',
  REVOKED = 'REVOKED',
}

export interface Subscription {
  id: string;
  userId?: string;
  packageName: string;
  productId: string;
  purchaseToken: string;
  status: SubscriptionStatus;
  startTime: Date;
  expiryTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<Subscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    packageName: { type: String, required: true },
    productId: { type: String, required: true },
    purchaseToken: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
    },
    startTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const SubscriptionModel = model<Subscription>(
  'Subscription',
  subscriptionSchema
);
