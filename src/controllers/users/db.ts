import { User } from "../../model/schema";
import { Balance } from "../../model/balanceSchema";
import { History } from "../../model/historySchema";

export async function createUserDB(data: any) {
  try {
    const newUser = await User.create(data);
    return {
      success: true,
      data: newUser,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function getUserSingle(param: any) {
  try {
    const user = await User.find(param);
    return {
      success: true,
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function insertBalance(data: any) {
  try {
    const insertBalance = await Balance.create(data);
    return {
      success: true,
      data: insertBalance,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function insertHistory(data: any) {
  try {
    const insertHistory = await History.create(data);
    return {
      success: true,
      data: insertHistory,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function getUserBalance(param: any) {
  try {
    const balance = await Balance.findOne(param);
    return {
      success: true,
      data: balance,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function updateUserBalance(param: any, payload: any){
  try {
    const updateBalance = await Balance.findOneAndUpdate(param, payload);
    return {
      success: true,
      data: updateBalance,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

export async function getHistoryBalance(param: any) {
  try {
    const balance = await History.find(param);
    return {
      success: true,
      data: balance,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}
