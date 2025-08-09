import { Schema, model } from 'mongoose';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  ON_HOLD = 'ON_HOLD',
  REVOKED = 'REVOKED',
}

export interface Subscription {
  id: string;
  userId?: string;
  packageName: string;
  productId: string;
  purchaseToken: string;
  status: SubscriptionStatus;
  /** The reason why a subscription was canceled or is not auto-renewing. Possible values are: 0. User canceled the subscription 1. Subscription was canceled by the system, for example because of a billing problem 2. Subscription was replaced with a new subscription 3. Subscription was canceled by the developer */
  cancelReason?: number;
  autoRenewing?: boolean;
  /** The type of purchase of the subscription. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code) */
  purchaseType?: number;
  priceCurrencyCode?: string;
  price?: number;
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
    cancelReason: { type: Number, required: false },
    autoRenewing: { type: Boolean, required: false },
    purchaseType: { type: Number, required: false },
    priceCurrencyCode: { type: String, required: false },
    price: { type: Number, required: false },
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
