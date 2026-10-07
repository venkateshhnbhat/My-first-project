export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'URGENT_SUPPORT';

export type TrendDirection = 'IMPROVING' | 'STABLE' | 'INCREASING' | 'VOLATILE' | 'INSUFFICIENT_DATA';

export type SupportCategory = 'SELF_CARE' | 'SOCIAL_SUPPORT' | 'PROFESSIONAL_SUPPORT' | 'URGENT_SUPPORT' | 'EMERGENCY_SUPPORT';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  ageRange?: string;
  preferredLanguage: string;
  timezone: string;
  notificationEnabled: boolean;
  consentGiven: boolean;
  consentDate?: string;
  consentVersion?: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-10
  stress: number; // 1-10
  anxiety: number; // 1-10
  sleepQuality: number; // 1-10
  energy: number; // 1-10
  socialConnection: number; // 1-10
  dailyFunctioning: number; // 1-10
  journalText?: string;
  createdAt: string;
}

export interface ContributingFactor {
  factor: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  severity: 'mild' | 'moderate' | 'elevated';
  evidence: string;
}

export interface SupportiveRecommendation {
  type: SupportCategory;
  title: string;
  description: string;
  actionableSteps?: string[];
}

export interface Assessment {
  id: string;
  userId: string;
  checkInId?: string;
  riskLevel: RiskLevel;
  trendDirection: TrendDirection;
  distressScore: number; // 0-100
  confidenceScore: number; // 0-100
  summary: string;
  contributingFactors: ContributingFactor[];
  recommendations: SupportiveRecommendation[];
  professionalSupportRecommended: boolean;
  urgentSupportRecommended: boolean;
  safetyNotice: string;
  createdAt: string;
}

export interface JournalEmotion {
  label: string;
  intensity: number; // 0.0 - 1.0
}

export interface JournalAnalysis {
  id: string;
  checkInId?: string;
  sentiment: 'positive' | 'neutral' | 'mixed' | 'concerning';
  emotions: JournalEmotion[];
  themes: { label: string; confidence: number }[];
  distressSignals: { label: string; confidence: number }[];
  safetyFlag: boolean;
  createdAt: string;
}

export interface SupportResource {
  id: string;
  name: string;
  description: string;
  resourceType: 'crisis_hotline' | 'text_line' | 'organization' | 'community' | 'emergency';
  countryCode: string;
  phone?: string;
  website?: string;
  availableHours: string;
  isEmergency: boolean;
  badges: string[];
}
