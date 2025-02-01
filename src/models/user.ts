import { Schema, model } from 'mongoose';

export interface User {
  username: string;
  email: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>('User', userSchema);
