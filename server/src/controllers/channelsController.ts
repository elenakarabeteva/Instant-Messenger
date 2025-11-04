import * as express from 'express';
import { User } from "../models/user";
import { Channel, IChannel } from "../models/channel";
import mongoose from 'mongoose';

export const getAllChannels = async (request: express.Request, response: express.Response) => {
    try {
        const channels = await Channel.find();
        response.status(200).json(channels);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching channels' });
    }
};

export const createNewChannel = async (request: express.Request, response: express.Response) => {
    try {
        const { name, admin_list, user_list, nickname_list, message_list } = request.body;

        const newChannel = new Channel({
            name,
            admin_list,
            user_list,
            nickname_list,
            message_list
        });

        await newChannel.save();
        response.status(201).json(newChannel);
    } catch (err) {
        response.status(400).json({ error: (err as Error).message });
    }
};

export const createNewPrivateChannel = async (request: express.Request, response: express.Response) => {
    try {
        const { firstUser, secondUser } = request.params;

        const existingChannel = await Channel.findOne({
            admin_list: { $all: [firstUser, secondUser] },
            $and: [
                { user_list: { $all: [firstUser, secondUser] } },
                { user_list: { $size: 2 } }
            ]
        });

        if (existingChannel) {
            return response.status(200).json(existingChannel);
        }

        const newChannel = new Channel({
            name: request?.body?.name,
            admin_list: [firstUser, secondUser],
            user_list: [firstUser, secondUser],
            nickname_list: [],
            message_list: [],
            isPrivate: true
        });

        await newChannel.save();
        response.status(201).json(newChannel);
    } catch (err) {
        response.status(400).json({ error: (err as Error).message });
    }
};

export const getChannelById = async (request: express.Request, response: express.Response) => {
    try {
        const channel = await Channel.findById(request.params.id);

        if (!channel) {
            return response.status(404).json({ error: 'Channel not found' });
        }

        response.status(201).json(channel);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching channel' });
    }
};

export const editChannel = async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: 'Invalid channel ID.' });
        }

        // 1) Extract only the fields we allow to be updated:
        const {
            name,
            user_list: newUserList,
            admin_list: newAdminList,
            nickname_list: newNicknameList,
            isPrivate: newIsPrivate
        } = request.body as Partial<IChannel>;

        // 2) Build an "updateDoc" containing only the provided fields:
        const updateDoc: Partial<IChannel> = {};
        if (typeof name === 'string') {
            updateDoc.name = name.trim();
        }
        if (Array.isArray(newUserList)) {
            updateDoc.user_list = newUserList.map(u => u.toString());
        }
        if (Array.isArray(newAdminList)) {
            updateDoc.admin_list = newAdminList.map(a => a.toString());
        }
        if (Array.isArray(newNicknameList)) {
            updateDoc.nickname_list = newNicknameList.map(n => ({
                user_id: n.user_id.toString(),
                nickname: n.nickname.toString().slice(0, 30)
            }));
        }
        if (typeof newIsPrivate === 'boolean') {
            updateDoc.isPrivate = newIsPrivate;
        }

        // 3) If both user_list and admin_list are being updated, verify admin ⊆ user_list
        if (updateDoc.user_list && updateDoc.admin_list) {
            const userSet = new Set(updateDoc.user_list);
            const everyAdminIsUser = updateDoc.admin_list.every((a) => userSet.has(a));
            if (!everyAdminIsUser) {
                return response.status(400).json({
                    error: 'Each admin in admin_list must also be present in user_list.'
                });
            }
        }

        // 4) If only admin_list is provided (and not user_list), we should fetch the existing user_list
        //    to verify the subset constraint. (Otherwise, Mongoose will still save, but you may break invariants.)
        if (updateDoc.admin_list && !updateDoc.user_list) {
            // Fetch the current channel’s user_list so we can verify:
            const existingChannel = await Channel.findById(id).select('user_list').lean();
            if (!existingChannel) {
                return response.status(404).json({ error: 'Channel not found.' });
            }
            const userSet = new Set(existingChannel.user_list);
            const everyAdminIsUser = updateDoc.admin_list.every((a) => userSet.has(a));
            if (!everyAdminIsUser) {
                return response.status(400).json({
                    error: 'Each admin in admin_list must also be present in the existing user_list.'
                });
            }
        }

        // 5) Perform the update. `runValidators: true` ensures our schema’s
        //    user_list length check (2..5) still applies.
        const updatedChannel = await Channel.findByIdAndUpdate(
            id,
            { $set: updateDoc },
            { new: true, runValidators: true } // <-- returns the new doc & enforces validators
        ).lean();

        if (!updatedChannel) {
            return response.status(404).json({ error: 'Channel not found.' });
        }

        return response.status(200).json(updatedChannel);
    } catch (err) {
        // If Mongoose validation fails, it throws a ValidationError
        if (err instanceof mongoose.Error.ValidationError) {
            return response.status(400).json({ error: err.message });
        }
        console.error(err);
        return response.status(500).json({ error: 'Server error.' });
    }
};