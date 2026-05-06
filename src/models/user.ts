import { Schema, model } from 'mongoose';

export interface User {
  id: string;
  username: string;
  email: string;
  googleId: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    passwordHash: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>('User', userSchema);
