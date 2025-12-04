// meeting.model.ts
import { Schema, model } from 'mongoose';
import { IMeeting } from './meeting.interface';

const MeetingSchema = new Schema<IMeeting>({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  },

  title: { 
    type: String, 
    required: true, 
    trim: true 
  },

  transcript: [{
    person: { type: String },
    speech: { type: String },
    timestamp: { type: String },
    _id: false
  }],

  engagementScore: { 
    type: Number, 
    default: 0 
  },

  overallScore: { 
    type: Number, 
    default: 0 
  },

  sentimentScore: { 
    type: Number, 
    default: 5,
    max: 10,
    min: 0
  },

  talktimeDistribution: [{
    person: { type: String },
    percentage: { type: Number, min: 0, max: 100 },
    _id: false
  }],
  targetSales: [{
    productOrServiceTitle: { type: String },
    description: { type: String, min: 0, max: 100 },
    _id: false
  }],

  questions: [{
    question: { type: String},
    isAsked: { type: Boolean},
    _id: false
  }],

  activeListenningScore: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
    required: true,
    default: 'C',
  },

  topicsDiscussed: [String],

  opportunities: [{
    title: { type: String },
    description: { type: String },
    _id: false
  }],

  risksIdentified: [{
    title: { type: String},
    description: { type: String},
    _id: false
  }],

  keyPoints: [{
    title: { type: String},
    description: { type: String},
    _id: false
  }],

  actionItems: [{
    action: { type: String},
    assignedTo: { type: String},
    _id: false
  }],

  nextSteps: [{
    step: { type: String},
    timestamp: { type: String},
    _id: false
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
MeetingSchema.index({ creatorId: 1, accountId: 1, createdAt: -1 });
MeetingSchema.index({ accountId: 1, createdAt: -1 });

export const MeetingModel = model<IMeeting>('Meeting', MeetingSchema);