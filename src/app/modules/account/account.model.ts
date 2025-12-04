import mongoose, { Schema, model } from 'mongoose';
import { IAccount, IStakeholder } from './account.interface';

// Sub-schema for Stakeholder
const StakeholderSchema = new Schema<IStakeholder>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    linkedinUrl: String,
    tenureMonths: Number,
    isDecisionMaker: { type: Boolean, default: false },
    personalityTraits: [String],
    notes: String,
  },
  { _id: true }
);

const AccountSchema = new Schema<IAccount>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,   // ← THIS FIXES THE ERROR
      ref: 'User',
      required: true,
      index: true,
    },

    // Core company info
    companyName: { type: String, required: true, trim: true },
    domain: { type: String, sparse: true },
    website: String,
    linkedinUrl: String,
    headquarters: String,
    industry: String,
    employeeCount: Number,
    revenue: Number,
    marketCap: Number,
    fundingRaised: Number,
    lastFundingRound: Date,

    hiringData: { type: String, default: '' },
    customerReview: { type: String, default: '' },
    financialStatement: { type: String, default: '' },
    productDocumentation: { type: String, default: '' },

    // AI-enriched intelligence
    techStack: { type: [String], default: [] },
    mission: String,
    vision: String,
    keyChallenges: { type: [String], default: [] },
    recentNews: { type: [String], default: [] },
    buyingSignals: { type: [String], default: [] },

    // Relationships
    stakeholders: { type: [StakeholderSchema], default: [] },

    opportunities: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: Number, required: true },
          status: {
            type: String,
            enum: ['negotiation', 'locked', 'proposed'],
            required: true,
          },
          probability: { type: Number, min: 0, max: 100, required: true },
          _id: false,
        },
      ],
      default: [],
    },

    upsellOpportunities: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          _id: false,
        },
      ],
      default: [],
    },

    // Health & alerts
    accountHealth: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    riskAlerts: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
AccountSchema.index({ creatorId: 1, companyName: 1 });
AccountSchema.index({ domain: 1 });
AccountSchema.index({ 'opportunities.status': 1 });

export default model<IAccount>('Account', AccountSchema);