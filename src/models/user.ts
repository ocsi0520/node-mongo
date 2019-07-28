import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string
  password: string
  name: string
  gender: 'female' | 'male' | 'unknown'
  birthDate: Date
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);
