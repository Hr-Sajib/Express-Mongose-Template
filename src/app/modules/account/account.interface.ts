import { Types, Document } from 'mongoose'

export interface IStakeholder {
  _id?: Types.ObjectId
  name: string
  position: string
  linkedinUrl?: string
  tenureMonths?: number
  isDecisionMaker?: boolean
  personalityTraits?: string[]
  notes?: string
}


export interface IUpsellOpportunity { 
  _id?: Types.ObjectId
  title: string
  description?: string
  estimatedValue?: number
  confidence?: number // 0–100
  suggestedNextStep?: string
}


export interface IAccount extends Document {
  creatorId: Types.ObjectId

  // Core company info
  companyName: string
  domain?: string // business domain
  website?: string
  linkedinUrl?: string
  headquarters?: string
  industry?: string
  employeeCount?: number
  revenue?: number // USD
  marketCap?: number
  fundingRaised?: number
  lastFundingRound?: Date
  hiringData: string
  customerReview: string
  financialStatement: string
  productDocumentation: string

  // AI-enriched intelligence
  techStack: string[]
  mission?: string
  vision?: string
  keyChallenges: string[]
  recentNews: string[]
  buyingSignals: string[]

  // Relationships
  stakeholders: IStakeholder[]
  opportunities: {
        name: string
        value: number
        status: 'negotiation' | 'locked' | 'proposed'
        probability: number
    }[]
  upsellOpportunities: {
        title: string
        description: string
    }[]

  // Health & alerts
  accountHealth: number // 0–100
  riskAlerts: string[]

}