import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    profile_pic: string;
    last_active: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    profile_pic: { type: String, required: false },
    last_active: { type: Date, required: true }
});

export const User = mongoose.model<IUser>('User', UserSchema);