import { Schema, model } from "mongoose";
import Joi from "joi";

export const UserSchemaValidate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required()
})

interface IUsers {
    name: string,
    email: string,
    password: string
}

const usersSchema = new Schema<IUsers>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

export const User = model<IUsers>('Users', usersSchema)