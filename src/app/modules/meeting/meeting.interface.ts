import { Types } from "mongoose";

export interface IMeeting {
    _id: Types.ObjectId
    creatorId: Types.ObjectId
    accountId: Types.ObjectId

    title: string
    targetSales: {productOrServiceTitle: string, description: string}[]
    transcript: {person: string, speech: string, timestamp: string}[] //ISO timestamp

    engagementScore: number
    overallScore: number
    sentimentScore: number
    talktimeDistribution: {person: string, percentage: number}[]

    questions: {question: string, isAsked: boolean}[]
    activeListenningScore : 'A+'| 'A'| 'A-'| 'B+'| 'B'| 'B-'| 'C+'| 'C'| 'C-'| 'D+'| 'D'| 'D-'| 'F'
    topicsDiscussed: string[]
    opportunities: {title: string, description: string}[]
    risksIdentified: {title: string, description: string}[]
    keyPoints: {title: string, description: string}[]
    actionItems: {action: string, assignedTo: string}[]
    nextSteps: {step: string, timestamp: string}

}


export interface CreateMeetingDto {
  accountId: string;
  title: string;
  targetSales?: {
    productOrServiceTitle: string;
    pdfFile?: Express.Multer.File; // Multer adds this
  }[];
}