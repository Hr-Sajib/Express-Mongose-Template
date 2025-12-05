// controllers/meeting.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { meetingService } from "./meeting.service";
import { extractFilesText } from "./util.ocr";




// controllers/meeting.controller.ts
const createMeeting = catchAsync(async (req: Request, res: Response) => {
  const { accountId, title } = req.body;
  const creatorId = req.user.userId;
  const files = req.files as Express.Multer.File[];

  let targetSales: Array<{ productOrServiceTitle: string; description: string }> = [];

  if (files && files.length > 0) {
    console.log(`Processing ${files.length} file(s)...`);
    const combinedText = await extractFilesText(files);

    targetSales = [{
      productOrServiceTitle: title.trim(),
      description: combinedText,
    }];
  }

  const meeting = await meetingService.createMeeting({
    creatorId,
    accountId,
    title: title.trim(),
    targetSales,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Meeting created with document analysis',
    data: meeting,
  });
});

const getMeetingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const meeting = await meetingService.getMeetingById(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting retrieved successfully",
    data: meeting,
  });
});

const updateMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const updates = req.body;

  const updatedMeeting = await meetingService.updateMeeting(id, userId, updates);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting updated successfully",
    data: updatedMeeting,
  });
});

const deleteMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;

  await meetingService.deleteMeeting(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meeting deleted successfully",
    data: null,
  });
});

export const meetingController = {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};