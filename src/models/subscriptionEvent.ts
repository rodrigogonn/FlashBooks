import { Schema, model, Types } from 'mongoose';

export interface SubscriptionEvent {
  subscriptionId: Types.ObjectId;
  notificationType: number;
  eventTime: Date;
  rawEventData: any;
  createdAt: Date;
}

const subscriptionEventSchema = new Schema<SubscriptionEvent>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    notificationType: { type: Number, required: true },
    eventTime: { type: Date, required: true },
    rawEventData: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SubscriptionEventModel = model<SubscriptionEvent>(
  'SubscriptionEvent',
  subscriptionEventSchema
);
