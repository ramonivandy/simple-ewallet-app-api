import { createUserDB } from "./db";
import { Request, Response } from "express";
import { UserSchemaValidate } from "../../model/schema"
import bcrypt from 'bcrypt'

function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

export const createUser = async (req: Request, res: Response) => {
    const password_hash = await hashPassword(req.body.password)
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: password_hash
    }

    const {error, value} = UserSchemaValidate.validate(data)
    if(error){
        res.status(500).send(error.message)
    }
    const db = await createUserDB(value)
    res.status(201).send(db)
}

module.exports = {
    createUser
}