import { Schema, model } from 'mongoose';

export interface UserDocument {
  id: string;
  username: string;
  email: string;
  password: string;
  googleId?: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('User', userSchema);
