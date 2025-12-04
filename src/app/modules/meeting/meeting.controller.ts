// controllers/meeting.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { meetingService } from "./meeting.service";
import { extractPdfText } from "./util.ocr";



const createMeeting = catchAsync(async (req: Request, res: Response) => {
  const { accountId, title } = req.body;
  const creatorId = req.user.userId;
  const pdfFile = req.file; // from multer.single('targetSalesPdf')

  // Default: no targetSales
  let targetSales: Array<{ productOrServiceTitle: string; description: string }> = [];

  // If PDF is uploaded → extract text using OpenAI
  if (pdfFile?.buffer) {
    (async () => {
      try {
        const extractedText = await extractPdfText(pdfFile.buffer);

        console.log("extractedText: ",extractedText)

        targetSales = [
          {
            productOrServiceTitle: title.trim(),
            description: extractedText,
          },
        ];
      } catch (error: any) {
        console.error('OpenAI PDF extraction failed:', error.message);
        targetSales = [
          {
            productOrServiceTitle: title.trim(),
            description: '[Failed to extract text from PDF]',
          },
        ];
      }

      // Now create the meeting
      const meeting = await meetingService.createMeeting({
        creatorId,
        accountId,
        title: title.trim(),
        targetSales,
      });

      res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Meeting created successfully with deck analysis',
        data: meeting,
      });
    })();
  } else {
    // No PDF uploaded → just create meeting
    const meeting = await meetingService.createMeeting({
      creatorId,
      accountId,
      title: title.trim(),
      targetSales: [],
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Meeting created successfully',
      data: meeting,
    });
  }
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