import { GoogleGenAI } from '@google/genai';
import { assessmentResponseSchema, journalAnalysisSchema } from '../schemas/index.js';

const SYSTEM_INSTRUCTION = `You are a safety-focused AI assistant supporting a mental-health monitoring application.

Your role is to analyze voluntarily provided, self-reported information and identify changes in reported distress over time.

You are NOT a doctor, therapist, psychiatrist, emergency responder, or diagnostic system.

You must NOT diagnose:
- depression
- anxiety disorders
- PTSD
- bipolar disorder
- psychosis
- personality disorders
- or any other psychiatric condition.

You must not present a prediction as a medical fact.

Your task is limited to:
1. identifying broad patterns in user-provided information,
2. estimating a non-diagnostic distress-risk category,
3. describing changes over time,
4. identifying contributing self-reported indicators,
5. recommending supportive next steps,
6. recommending professional support when appropriate,
7. recommending urgent support resources when the information indicates possible immediate danger.

Always distinguish between:
- observed self-reported information,
- model interpretation,
- uncertainty,
- recommendations.

Use compassionate, neutral, non-judgmental language.
Never shame the user.
Never blame the user.
Never minimize distress.
Never claim certainty about a person's mental state.
Never tell the user to stop medication.
Never prescribe medication.
Never provide medical treatment plans.
Never encourage self-harm or harmful behavior.

If the information indicates possible immediate danger, prioritize immediate human support and emergency/crisis resources.
Do not attempt to manage an emergency autonomously.
If there is insufficient historical data, explicitly state that trend confidence is limited.
Do not infer sensitive demographic characteristics.
Do not infer an atrocity, abuse, diagnosis, or trauma history unless explicitly supplied by the user.

Return only valid JSON matching the required schema.`;

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateGeminiAssessment(
  currentCheckIn: Record<string, any>,
  recentHistory: Record<string, any>[],
  trendFeatures: Record<string, any>,
  journalSignals?: Record<string, any>
) {
  const ai = getAIClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const userPrompt = `Evaluate the following voluntary self-reported mental-health data:

CURRENT CHECK-IN:
${JSON.stringify(currentCheckIn, null, 2)}

RECENT HISTORY:
${JSON.stringify(recentHistory, null, 2)}

TREND FEATURES:
${JSON.stringify(trendFeatures, null, 2)}

OPTIONAL JOURNAL SIGNALS:
${journalSignals ? JSON.stringify(journalSignals, null, 2) : 'None provided'}

Evaluate:
- Current reported distress level (0-100)
- Risk level (LOW, MODERATE, HIGH, URGENT_SUPPORT)
- Trend direction (IMPROVING, STABLE, INCREASING, VOLATILE, INSUFFICIENT_DATA)
- Key contributing factors
- Non-diagnostic supportive next steps

Return JSON strictly conforming to:
{
  "riskLevel": "LOW | MODERATE | HIGH | URGENT_SUPPORT",
  "trendDirection": "IMPROVING | STABLE | INCREASING | VOLATILE | INSUFFICIENT_DATA",
  "distressScore": number (0-100),
  "confidenceScore": number (0-100),
  "summary": string,
  "contributingFactors": [
    {
      "factor": string,
      "direction": "increasing | decreasing | stable | volatile",
      "severity": "mild | moderate | elevated",
      "evidence": string
    }
  ],
  "recommendations": [
    {
      "type": "SELF_CARE | SOCIAL_SUPPORT | PROFESSIONAL_SUPPORT | URGENT_SUPPORT | EMERGENCY_SUPPORT",
      "title": string,
      "description": string,
      "actionableSteps": [string]
    }
  ],
  "professionalSupportRecommended": boolean,
  "urgentSupportRecommended": boolean,
  "safetyNotice": "This is a non-diagnostic screening estimate and not a medical diagnosis."
}`;

  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the backend.');
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      { role: 'user', parts: [{ text: userPrompt }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json'
    }
  });

  const rawText = response.text || '{}';
  const parsed = JSON.parse(rawText);

  // Validate strictly with Zod
  const validated = assessmentResponseSchema.parse(parsed);
  return validated;
}

export async function analyzeJournalWithGemini(journalText: string) {
  const ai = getAIClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const prompt = `Analyze the broad emotional signals in this voluntary reflection:
JOURNAL ENTRY:
${journalText}

Return valid JSON:
{
  "sentiment": "positive | neutral | mixed | concerning",
  "emotions": [{ "label": string, "intensity": number (0-1) }],
  "themes": [{ "label": string, "confidence": number (0-1) }],
  "distressSignals": [{ "label": string, "confidence": number (0-1) }],
  "safetyFlag": boolean
}`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json'
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  return journalAnalysisSchema.parse(parsed);
}
