import { Schema, model } from 'mongoose';

export interface UserDocument {
  id: string;
  username: string;
  email: string;
  googleId: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('User', userSchema);
