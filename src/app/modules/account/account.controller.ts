import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { accountService } from "./account.service";
import sendResponse from "../../utils/sendResponse";

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user.userId; // from auth middleware

  const account = await accountService.createAccountIntoDB(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully",
    data: account,
  });
});

const getMyAccounts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const accounts = await accountService.getAccountsByCreatorId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Accounts retrieved successfully",
    data: accounts,
  });
});

const getAccountById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  const account = await accountService.getAccountById(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account fetched successfully",
    data: account,
  });
});

const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;
  const updates = req.body;

  const updatedAccount = await accountService.updateAccountById(id, userId, updates);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account updated successfully",
    data: updatedAccount,
  });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  await accountService.deleteAccountById(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account deleted successfully",
    data: null,
  });
});

export const accountController = {
  createAccount,
  getMyAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};