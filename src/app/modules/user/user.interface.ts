import { Document, Types } from "mongoose";

// Enum for User Roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}


// User Schema Definition
export interface IUser extends Document {
  _id: Types.ObjectId;

  firstName: string
  lastName: string
  email: string;
  password: string;
  role: UserRole;

  passwordResetOtp: {
    otpCode: number | null,
    otpExpireTime: string | null,
  }

  signInMethod: 'password'|'google'
  googleToken: string

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean

  // business fields 
  strength: string
  improvement: string
  pattern: string

  // settings 
  emailNotification: boolean
  meetingReminder: boolean
  aiInsight: boolean
  salesMethodology: 'bant'|'meddic'|'meddpicc'|'spin'|'solutionSelling'|'valueSelling'|'challengerSales'
  difficultyLevel: 'hard'|'intermediate'|'easy'
}
