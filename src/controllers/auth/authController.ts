import { getUserSingle } from "../users/db"
import { Request, Response } from "express";
import { loginValidate } from "../../model/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  /* get user data */
  const { error, value } = loginValidate.validate(payload);
  if (error) {
    res.status(500).send(error.message);
  }

  const dataUser = await getUserSingle({
    email: value.email,
  });

  /* if user not found */
  if (!dataUser.success || !dataUser.data || dataUser.data.length === 0) {
    return res.status(401).json({
      error: "email or password is wrong!",
    });
  }

  const userPassword = dataUser.data[0]?.password;
  const isPasswordValid = await bcrypt.compare(payload.password, userPassword);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: "email or password is wrong!",
    });
  }

  /* proceed jwt token */
  const token = jwt.sign(
    { 
        id: dataUser.data[0]?._id, 
        userName: dataUser.data[0]?.name, 
        email: dataUser.data[0]?.email
    },
    process.env.JWT_SECRET!, // Make sure to set this in your .env file
    { expiresIn: "1h" } // Token expires in 1 hour
  );
  return res.status(200).json({
    success: true,
    jwtToken: token,
    user: {
      id: dataUser.data[0]?._id,
      email: dataUser.data[0]?.email,
      name: dataUser.data[0]?.name
    }
  });
};
