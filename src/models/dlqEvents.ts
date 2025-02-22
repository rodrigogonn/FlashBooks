import { Schema, model } from 'mongoose';

export interface DlqEvent {
  id: string;
  topicName: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const dlqEventSchema = new Schema<DlqEvent>(
  {
    topicName: { type: String, required: true },
    message: { type: String, required: true },
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

export const DlqEventModel = model('DlqEvent', dlqEventSchema);
