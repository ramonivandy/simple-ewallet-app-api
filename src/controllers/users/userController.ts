import {
  createUserDB,
  insertBalance,
  getUserSingle,
  insertHistory,
  getUserBalance,
  getHistoryBalance,
  updateUserBalance,
} from "./db";
import { Request, Response } from "express";
import { UserSchemaValidate } from "../../model/schema";
import { BalanceSchemaValidate } from "../../model/balanceSchema";
import bcrypt from "bcrypt";
import { AuthRequest } from "../../middleware/authMiddleware";
import { Types } from "mongoose";

function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export const createUser = async (req: Request, res: Response) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  const { error, value } = UserSchemaValidate.validate(payload);
  if (error) {
    return res.status(500).send(error.message);
  }

  /* check existing user same or not */
  const isDuplicateUser = await getUserSingle({
    $or: [{ email: value.email }, { phone: value.phone }],
  });
  if (
    isDuplicateUser &&
    isDuplicateUser.data &&
    isDuplicateUser.data.length > 0
  ) {
    return res.status(409).json({
      error: "email or phone number already used!",
    });
  }

  /* insert user */
  value.password = await hashPassword(req.body.password); //encrypt password
  const createUser = await createUserDB(value);
  if (!createUser || !createUser.data) {
    return res.status(500).send(createUser);
  }

  /* insert balance */
  const balance = await insertBalance({
    user_id: createUser.data?._id,
    balance: 1000000,
  });
  if (!balance || !balance.data) {
    return res.status(500).send(balance);
  }

  /* insert history */
  const history = await insertHistory({
    user_id: createUser.data?._id,
    balance_change: 1000000,
    created_at: new Date(),
  });

  let returnArr = {
    name: createUser.data?.name,
    email: createUser.data?.email,
    balance: balance.data?.balance,
    history_id: history.data?._id,
  };
  return res.status(201).json({
    success: true,
    data: returnArr
  });
};

export const dashboard = async (req: AuthRequest, res: Response) => {
  /* 
        1. Get balance from balance collection
        2. Add balance, history of add balance
    */
  const { id, name, email } = req.user!;

  /* get user balance */
  const userBalance = await getUserBalance({
    user_id: Types.ObjectId.createFromHexString(id),
  });

  const historyBalance = await getHistoryBalance({
    user_id: Types.ObjectId.createFromHexString(id),
  });

  return res.status(200).json({
    success: true,
    data: {
      balance: userBalance.data,
      history: historyBalance.data,
    },
  });
};

export const updateBalance = async (req: AuthRequest, res: Response) => {
  /* 
  1. Update balance
  2. Insert balance history
  */
  const { id, name, email } = req.user!;
  let payload = {
    user_id: Types.ObjectId.createFromHexString(id),
    balance: req.body.update_balance,
    created_at: new Date(),
  };

  const { error, value } = BalanceSchemaValidate.validate(payload);
  /* get current balance */
  const userBalance = await getUserBalance({
    user_id: Types.ObjectId.createFromHexString(id),
  });

  console.log(userBalance)
  if (!userBalance || !userBalance.data) {
    return res.status(404).json({ error: "User balance not found" });
  }
  const updateBalance = await updateUserBalance(
    {
      user_id: Types.ObjectId.createFromHexString(req.user!.id),
    },
    {
      balance: value.balance,
    }
  );
  if (!updateBalance.success) {
    return res.status(500).json({
      success: false,
      message: "Failed to update balance.",
    });
  }

  const changesBalance = value.balance - userBalance.data.balance;
  const history = await insertHistory({
    user_id: id,
    balance_change: changesBalance,
    created_at: new Date(),
  });
  if (!history.success) {
    return res.status(500).json({
      success: false,
      message: "Failed to update balance.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Success update balance and insert history!",
    data: {
      balance: value.balance,
      history: history.data
    }
  });
};
