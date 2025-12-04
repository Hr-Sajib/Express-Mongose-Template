// services/meeting.service.ts
import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../errors/appError";
import { IMeeting } from "./meeting.interface";
import { MeetingModel } from "./meeting.model";
import { evaluateMeetingTranscript } from "./meeting.utils";


export const createMeeting = async (payload: {
  creatorId: Types.ObjectId | string;
  accountId: Types.ObjectId | string;
  title: string;
  targetSales?: { productOrServiceTitle: string; description: string }[];
}): Promise<IMeeting> => {
  const meeting = await MeetingModel.create({
    creatorId: new Types.ObjectId(payload.creatorId),
    accountId: new Types.ObjectId(payload.accountId),
    title: payload.title,
    targetSales: payload.targetSales || [],
    engagementScore: 0,
    overallScore: 0,
    sentimentScore: 5,
    activeListenningScore: 'C',
    talktimeDistribution: [],
    topicsDiscussed: [],
    opportunities: [],
    risksIdentified: [],
    keyPoints: [],
    actionItems: [],
    nextSteps: { step: '', timestamp: '' },
  });

  if (!meeting) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create meeting');
  }

  return meeting;
};

const getMeetingById = async (meetingId: string, userId: Types.ObjectId): Promise<IMeeting> => {
  const meeting = await MeetingModel.findOne({
    _id: meetingId,
    creatorId: userId,
  });

  if (!meeting) {
    throw new AppError(httpStatus.NOT_FOUND, "Meeting not found or access denied");
  }

  return meeting;
};

const updateMeeting = async (
  meetingId: string,
  userId: Types.ObjectId,
  updates: Partial<IMeeting>
): Promise<IMeeting> => {
  const meeting = await MeetingModel.findOne({
    _id: meetingId,
    creatorId: userId,
  });

  if (!meeting) {
    throw new AppError(httpStatus.NOT_FOUND, "Meeting not found or access denied");
  }

// Inside your updateMeeting service or controller
if (updates.transcript && Array.isArray(updates.transcript) && updates.transcript.length > 0) {
  try {
    const evaluation = await evaluateMeetingTranscript(updates.transcript);

    // Merge ALL AI-generated fields into updates
    Object.assign(updates, {
      engagementScore: evaluation.engagementScore,
      overallScore: evaluation.overallScore,
      sentimentScore: evaluation.sentimentScore,
      talktimeDistribution: evaluation.talktimeDistribution,
      activeListenningScore: evaluation.activeListenningScore,
      topicsDiscussed: evaluation.topicsDiscussed,
      opportunities: evaluation.opportunities,
      risksIdentified: evaluation.risksIdentified,
      keyPoints: evaluation.keyPoints,
      actionItems: evaluation.actionItems,
      nextSteps: evaluation.nextSteps,
    });


  } catch (error: any) {
    console.error('AI transcript evaluation failed:', error.message);
    // Don't block the update — just log and continue
    // Or throw if you want strict mode
  }
}

  const updatedMeeting = await MeetingModel.findByIdAndUpdate(
    meetingId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedMeeting) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update meeting");
  }

  return updatedMeeting;
};

const deleteMeeting = async (meetingId: string, userId: Types.ObjectId): Promise<void> => {
  const meeting = await MeetingModel.findOne({
    _id: meetingId,
    creatorId: userId,
  });

  if (!meeting) {
    throw new AppError(httpStatus.NOT_FOUND, "Meeting not found or access denied");
  }

  await MeetingModel.findByIdAndDelete(meetingId);
};

export const meetingService = {
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};

