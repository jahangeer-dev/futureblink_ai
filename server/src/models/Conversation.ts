import type { IConversation } from '../types/index.js';
import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

interface IConversationDocument extends Omit<IConversation, '_id'>, Omit<Document, 'model'> {}

const ConversationSchema = new Schema<IConversationDocument>(
    {
        prompt: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 10000,
        },
        response: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

ConversationSchema.index({ createdAt: -1 });

export const ConversationModel = model<IConversationDocument>('Conversation', ConversationSchema);
