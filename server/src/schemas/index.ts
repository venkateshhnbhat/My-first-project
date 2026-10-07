import { z } from 'zod';

export const checkInSchema = z.object({
  mood: z.number().int().min(1).max(10),
  stress: z.number().int().min(1).max(10),
  anxiety: z.number().int().min(1).max(10),
  sleepQuality: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  socialConnection: z.number().int().min(1).max(10),
  dailyFunctioning: z.number().int().min(1).max(10),
  journalText: z.string().max(5000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional()
});

export const contributingFactorSchema = z.object({
  factor: z.string(),
  direction: z.enum(['increasing', 'decreasing', 'stable', 'volatile']),
  severity: z.enum(['mild', 'moderate', 'elevated']),
  evidence: z.string()
});

export const recommendationSchema = z.object({
  type: z.enum([
    'SELF_CARE',
    'SOCIAL_SUPPORT',
    'PROFESSIONAL_SUPPORT',
    'URGENT_SUPPORT',
    'EMERGENCY_SUPPORT'
  ]),
  title: z.string(),
  description: z.string(),
  actionableSteps: z.array(z.string()).optional()
});

export const assessmentResponseSchema = z.object({
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'URGENT_SUPPORT']),
  trendDirection: z.enum(['IMPROVING', 'STABLE', 'INCREASING', 'VOLATILE', 'INSUFFICIENT_DATA']),
  distressScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  summary: z.string(),
  contributingFactors: z.array(contributingFactorSchema),
  recommendations: z.array(recommendationSchema),
  professionalSupportRecommended: z.boolean(),
  urgentSupportRecommended: z.boolean(),
  safetyNotice: z.string()
});

export const journalAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'mixed', 'concerning']),
  emotions: z.array(z.object({
    label: z.string(),
    intensity: z.number().min(0).max(1)
  })),
  themes: z.array(z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1)
  })),
  distressSignals: z.array(z.object({
    label: z.string(),
    confidence: z.number().min(0).max(1)
  })),
  safetyFlag: z.boolean()
});

export const consentSchema = z.object({
  consentVersion: z.string(),
  consented: z.boolean()
});
