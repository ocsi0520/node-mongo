import mongoose, { Schema, Document } from 'mongoose';

export interface _IUser {
  username: string
  password: string
  name: string
  gender: 'female' | 'male' | 'unknown'
  birthDate: Date
}

export interface IUser extends Document, _IUser {}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birthDate: { type: Date, required: true }
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);
