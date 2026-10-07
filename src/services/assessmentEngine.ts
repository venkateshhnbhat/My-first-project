import { CheckIn, Assessment, RiskLevel, ContributingFactor, SupportiveRecommendation } from '../types';
import { analyzeTrends, computeCheckInDistressScore } from './trendEngine';

export function generateRuleBasedAssessment(
  currentCheckIn: CheckIn,
  history: CheckIn[]
): Assessment {
  const trend = analyzeTrends(history, 14);
  const currentDistress = computeCheckInDistressScore(currentCheckIn);

  // Determine Contributing Factors
  const factors: ContributingFactor[] = [];

  if (currentCheckIn.stress >= 7) {
    factors.push({
      factor: 'Reported Stress',
      direction: trend.metrics.stress.direction,
      severity: currentCheckIn.stress >= 9 ? 'elevated' : 'moderate',
      evidence: `Stress is reported at ${currentCheckIn.stress}/10, reflecting elevated physiological and mental strain.`
    });
  }

  if (currentCheckIn.anxiety >= 7) {
    factors.push({
      factor: 'Reported Anxiety',
      direction: trend.metrics.anxiety.direction,
      severity: currentCheckIn.anxiety >= 9 ? 'elevated' : 'moderate',
      evidence: `Anxiety is rated at ${currentCheckIn.anxiety}/10, indicating heightened worry or nervousness.`
    });
  }

  if (currentCheckIn.sleepQuality <= 4) {
    factors.push({
      factor: 'Sleep Disruption',
      direction: trend.metrics.sleepQuality.direction,
      severity: currentCheckIn.sleepQuality <= 2 ? 'elevated' : 'moderate',
      evidence: `Sleep quality score is ${currentCheckIn.sleepQuality}/10, which can compound cognitive fatigue.`
    });
  }

  if (currentCheckIn.energy <= 4) {
    factors.push({
      factor: 'Physical & Mental Fatigue',
      direction: trend.metrics.energy.direction,
      severity: currentCheckIn.energy <= 2 ? 'elevated' : 'moderate',
      evidence: `Reported energy level is ${currentCheckIn.energy}/10.`
    });
  }

  if (currentCheckIn.socialConnection <= 3) {
    factors.push({
      factor: 'Social Disconnection',
      direction: trend.metrics.socialConnection.direction,
      severity: 'moderate',
      evidence: `Social connection rating is ${currentCheckIn.socialConnection}/10, indicating potential isolation.`
    });
  }

  if (currentCheckIn.dailyFunctioning <= 4) {
    factors.push({
      factor: 'Daily Task Impact',
      direction: trend.metrics.dailyFunctioning.direction,
      severity: currentCheckIn.dailyFunctioning <= 2 ? 'elevated' : 'moderate',
      evidence: `Reported daily functioning is ${currentCheckIn.dailyFunctioning}/10, suggesting everyday routines are difficult right now.`
    });
  }

  // Check urgent signals in journal text (keywords like suicide, harm, end it, cannot take it)
  const journalLower = (currentCheckIn.journalText || '').toLowerCase();
  const urgentKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'harm myself', 'cant go on', "can't go on"];
  const hasUrgentTextSignal = urgentKeywords.some(kw => journalLower.includes(kw));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  let professionalSupport = false;
  let urgentSupport = false;

  if (hasUrgentTextSignal || (currentDistress >= 85 && trend.persistence === 'persistent')) {
    riskLevel = 'URGENT_SUPPORT';
    urgentSupport = true;
    professionalSupport = true;
  } else if (currentDistress >= 70 || (currentDistress >= 60 && trend.trendDirection === 'INCREASING')) {
    riskLevel = 'HIGH';
    professionalSupport = true;
  } else if (currentDistress >= 40 || trend.trendDirection === 'INCREASING') {
    riskLevel = 'MODERATE';
    if (currentDistress >= 55) professionalSupport = true;
  } else {
    riskLevel = 'LOW';
  }

  // Formulate Recommendations
  const recommendations: SupportiveRecommendation[] = [];

  if (riskLevel === 'URGENT_SUPPORT') {
    recommendations.push({
      type: 'URGENT_SUPPORT',
      title: 'Connect with Immediate Crisis & Human Support',
      description: 'Your responses reflect acute distress. Please reach out to a trusted individual, a crisis line, or emergency resources right away.',
      actionableSteps: [
        'Call or text the 988 Suicide & Crisis Lifeline (or your local emergency contact)',
        'Reach out to someone you trust and let them know you are experiencing difficult feelings',
        'Move to a comfortable, secure environment and stay close to supportive persons'
      ]
    });
  } else if (riskLevel === 'HIGH') {
    recommendations.push({
      type: 'PROFESSIONAL_SUPPORT',
      title: 'Consider Connecting with a Mental Health Professional',
      description: 'Your recent check-ins reflect persistent elevated distress across multiple areas. Speaking with a counselor or therapist can offer personalized guidance.',
      actionableSteps: [
        'Review available counseling or community support resources in the resource directory',
        'Schedule a confidential consultation with a licensed health practitioner',
        'Share your recent trend patterns with a supportive person or provider'
      ]
    });
  }

  if (currentCheckIn.sleepQuality <= 5) {
    recommendations.push({
      type: 'SELF_CARE',
      title: 'Gentle Sleep Restoration',
      description: 'Rest is foundational for nervous system regulation.',
      actionableSteps: [
        'Aim for a regular wind-down schedule 45 minutes before sleep',
        'Minimize bright screen exposure before bedtime',
        'Consider quiet sensory activities such as calm breathing or soothing audio'
      ]
    });
  }

  if (currentCheckIn.socialConnection <= 4) {
    recommendations.push({
      type: 'SOCIAL_SUPPORT',
      title: 'Gradual Social Re-engagement',
      description: 'Feeling disconnected is common during periods of stress, but gentle connection can reduce emotional isolation.',
      actionableSteps: [
        'Send a brief text to a trusted friend or family member',
        'Spend brief time in a shared, low-pressure setting (such as a park or library)',
        'Remember you do not need to explain everything to benefit from kind company'
      ]
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'SELF_CARE',
      title: 'Maintain Supportive Daily Routines',
      description: 'Your indicators reflect stable coping. Continuing balanced habits supports long-term emotional well-being.',
      actionableSteps: [
        'Maintain balanced hydration, nourishing meals, and sleep routines',
        'Continue regular daily check-ins to notice any emerging shifts',
        'Acknowledge and celebrate the days where routines feel manageable'
      ]
    });
  }

  // Summary generation with strictly non-diagnostic phrasing
  let summary = '';
  if (riskLevel === 'URGENT_SUPPORT') {
    summary = 'Your recent responses indicate significantly elevated distress that may benefit from immediate compassionate support.';
  } else if (riskLevel === 'HIGH') {
    summary = 'Your recent responses show an increase in reported distress across multiple indicators compared with your historical baseline.';
  } else if (riskLevel === 'MODERATE') {
    summary = 'Your reported indicators show moderate fluctuations in stress and mood. Gentle supportive actions can help stabilize these patterns.';
  } else {
    summary = 'Your reported indicators show relative emotional stability and manageable levels of distress.';
  }

  const confidenceScore = history.length >= 7 ? 88 : history.length >= 3 ? 72 : 55;

  return {
    id: 'asmt-' + Math.random().toString(36).substring(2, 9),
    userId: currentCheckIn.userId,
    checkInId: currentCheckIn.id,
    riskLevel,
    trendDirection: trend.trendDirection,
    distressScore: currentDistress,
    confidenceScore,
    summary,
    contributingFactors: factors,
    recommendations,
    professionalSupportRecommended: professionalSupport,
    urgentSupportRecommended: urgentSupport,
    safetyNotice: 'This is a non-diagnostic screening estimate and not a medical diagnosis. It is based solely on voluntary self-reported inputs.',
    createdAt: new Date().toISOString()
  };
}
