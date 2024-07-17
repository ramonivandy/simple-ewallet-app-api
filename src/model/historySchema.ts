import { Schema, model } from "mongoose";

interface IHistory {
    user_id: String,
    balance_change: Number,
    created_at: Date
}

const historySchema = new Schema<IHistory>({
    user_id: {
        type: String,
        required: true
    },
    balance_change: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
})

export const History = model<IHistory>('history', historySchema)