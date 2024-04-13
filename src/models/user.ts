import { Schema, model } from 'mongoose';

// @TODO talvez deixar assim
// interface UserDocument extends Document {
//   id: string;
//   username: string;
//   email: string;
//   password: string;
//   createdAt: Date;
// }

// const userSchema = new Schema<UserDocument>({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = model<UserDocument>('User', userSchema);

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = model('User', userSchema);

// @TODO preciso disso?
// export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;
