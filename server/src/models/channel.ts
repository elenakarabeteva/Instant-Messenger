import mongoose, { Document, Schema } from 'mongoose';

interface INickname {
    user_id: string;
    nickname: string;
}

export interface IChannel extends Document {
    name: string;
    admin_list: string[];
    user_list: string[];
    nickname_list: INickname[];
    message_list: string[];
    isPrivate: boolean;
}

const NicknameSchema = new Schema<INickname>({
    user_id: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 30 }
}, { _id: false });

const ChannelSchema = new Schema<IChannel>({
    name: { type: String, required: true, maxlength: 50 },
    admin_list: [{ type: String, required: true }],
    user_list: {
        type: [String],
        required: true,
        validate: [(val: string[]) => val.length >= 2 && val.length <= 5, 'Броят на потребителите трябва да е между 2 и 5.']
    },
    nickname_list: { type: [NicknameSchema], required: true },
    message_list: [{ type: String, required: false }],
    isPrivate: { type: Boolean, required: false }
});

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);