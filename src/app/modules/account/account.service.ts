import httpStatus from "http-status";
import AppError from "../../errors/appError";
import Account from "./account.model";
import { IAccount } from "./account.interface";
import { Types } from "mongoose";

const createAccountIntoDB = async (creatorId: Types.ObjectId, payload: Partial<IAccount>) => {
  const account = await Account.create({
    ...payload,
    creatorId,
  });

  if (!account) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create account");
  }

  return account;
};

const getAccountsByCreatorId = async (creatorId: Types.ObjectId) => {
  const accounts = await Account.find({ creatorId }).sort({ createdAt: -1 });

  return accounts;
};

const getAccountById = async (accountId: string, creatorId: Types.ObjectId) => {
  const account = await Account.findOne({ _id: accountId, creatorId });

  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, "Account not found or access denied");
  }

  return account;
};

const updateAccountById = async (
  accountId: string,
  creatorId: Types.ObjectId,
  updates: Partial<IAccount>
) => {
  const account = await Account.findOne({ _id: accountId, creatorId });

  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, "Account not found or access denied");
  }

  const updatedAccount = await Account.findByIdAndUpdate(
    accountId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return updatedAccount;
};

const deleteAccountById = async (accountId: string, creatorId: Types.ObjectId) => {
  const account = await Account.findOne({ _id: accountId, creatorId });

  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, "Account not found or access denied");
  }

  await Account.findByIdAndDelete(accountId);

  return null;
};

export const accountService = {
  createAccountIntoDB,
  getAccountsByCreatorId,
  getAccountById,
  updateAccountById,
  deleteAccountById,
};