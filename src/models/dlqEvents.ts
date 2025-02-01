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
  }
);

export const DlqEventModel = model('DlqEvent', dlqEventSchema);
