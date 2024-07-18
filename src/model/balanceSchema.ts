import { Schema, model } from "mongoose";
import Joi from "joi";

export const BalanceSchemaValidate = Joi.object({
    user_id: Joi.string().required(),
    balance: Joi.number().required(),
})

interface IBalance {
    user_id: string,
    balance: number,
}

const balanceSchema = new Schema<IBalance>({
    user_id: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

export const Balance = model<IBalance>('balance', balanceSchema)