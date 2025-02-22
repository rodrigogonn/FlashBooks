import { Schema, model, Types } from 'mongoose';

export interface SubscriptionEvent {
  id: string;
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
