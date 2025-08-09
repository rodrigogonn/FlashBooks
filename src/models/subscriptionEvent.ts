import { Schema, model, Types } from 'mongoose';

export interface SubscriptionEvent {
  id: string;
  subscriptionId: Types.ObjectId;
  purchaseToken: string;
  notificationType: number;
  eventTime: Date;
  rawEventData: any;
  createdAt: Date;
  /** The reason why a subscription was canceled or is not auto-renewing. Possible values are: 0. User canceled the subscription 1. Subscription was canceled by the system, for example because of a billing problem 2. Subscription was replaced with a new subscription 3. Subscription was canceled by the developer */
  cancelReason?: number;
  /** The type of purchase of the subscription. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are: 0. Test (i.e. purchased from a license testing account) 1. Promo (i.e. purchased using a promo code) */
  purchaseType?: number;
  priceCurrencyCode?: string;
  price?: number;
}

const subscriptionEventSchema = new Schema<SubscriptionEvent>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    purchaseToken: { type: String, required: true },
    notificationType: { type: Number, required: true },
    eventTime: { type: Date, required: true },
    rawEventData: { type: Schema.Types.Mixed, required: true },
    cancelReason: { type: Number, required: false },
    purchaseType: { type: Number, required: false },
    priceCurrencyCode: { type: String, required: false },
    price: { type: Number, required: false },
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

export const SubscriptionEventModel = model<SubscriptionEvent>(
  'SubscriptionEvent',
  subscriptionEventSchema
);
