// account.validation.ts

import { z } from "zod";

const AccountBodySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  domain: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  headquarters: z.string().optional(),
  industry: z.string().optional(),
  employeeCount: z.number().int().positive().optional(),
  revenue: z.number().optional(),
  marketCap: z.number().optional(),
  fundingRaised: z.number().optional(),
  lastFundingRound: z.coerce.date().optional(),

  hiringData: z.string().default(""),
  customerReview: z.string().default(""),
  financialStatement: z.string().default(""),
  productDocumentation: z.string().default(""),

  techStack: z.array(z.string()).default([]),
  mission: z.string().optional(),
  vision: z.string().optional(),
  keyChallenges: z.array(z.string()).default([]),
  recentNews: z.array(z.string()).default([]),
  buyingSignals: z.array(z.string()).default([]),

  stakeholders: z
    .array(
      z.object({
        name: z.string(),
        position: z.string(),
        linkedinUrl: z.string().url().optional().or(z.literal("")),
        tenureMonths: z.number().int().optional(),
        isDecisionMaker: z.boolean().optional(),
        personalityTraits: z.array(z.string()).optional(),
        notes: z.string().optional(),
      })
    )
    .optional()
    .default([]),

  opportunities: z
    .array(
      z.object({
        name: z.string(),
        value: z.number().positive(),
        status: z.enum(["negotiation", "locked", "proposed"]),
        probability: z.number().min(0).max(100),
      })
    )
    .optional()
    .default([]),

  upsellOpportunities: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional()
    .default([]),

  accountHealth: z.number().min(0).max(100).optional(),
  riskAlerts: z.array(z.string()).default([]),
});

export const createAccountSchema = z.object({
  body: AccountBodySchema,
});

// This works 100% on all Zod versions (including 3.20, 3.21, 3.22+)
export const updateAccountSchema = z.object({
  body: AccountBodySchema.partial(), // all fields optional
});

export const AccountValidations = {
  createAccountSchema,
  updateAccountSchema,
};