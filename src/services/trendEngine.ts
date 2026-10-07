import { CheckIn, TrendDirection } from '../types';

export interface TrendMetricSummary {
  currentMean: number;
  previousMean: number;
  absoluteChange: number;
  percentChange: number;
  direction: 'increasing' | 'decreasing' | 'stable';
}

export interface LongitudinalAnalysis {
  daysAnalyzed: number;
  dataPointsCount: number;
  missingDataRate: number; // 0 to 1
  trendDirection: TrendDirection;
  compositeDistressMean: number;
  compositeDistressPrevious: number;
  metrics: {
    mood: TrendMetricSummary;
    stress: TrendMetricSummary;
    anxiety: TrendMetricSummary;
    sleepQuality: TrendMetricSummary;
    energy: TrendMetricSummary;
    socialConnection: TrendMetricSummary;
    dailyFunctioning: TrendMetricSummary;
  };
  mostChangedIndicators: string[];
  persistence: 'low' | 'moderate' | 'persistent';
  volatility: 'stable' | 'moderate' | 'high';
}

// Convert check-in to a standardized distress score (0 = lowest distress, 100 = highest distress)
export function computeCheckInDistressScore(checkIn: CheckIn): number {
  // Stress (1-10) -> higher is more distress
  // Anxiety (1-10) -> higher is more distress
  // Mood (1-10) -> lower is more distress => inverted: (11 - mood)
  // Sleep Quality (1-10) -> lower is more distress => inverted: (11 - sleepQuality)
  // Energy (1-10) -> lower is more distress => inverted: (11 - energy)
  // Social Connection (1-10) -> lower is more distress => inverted: (11 - socialConnection)
  // Daily Functioning (1-10) -> lower is more distress => inverted: (11 - dailyFunctioning)

  const distressIndicators = [
    checkIn.stress,
    checkIn.anxiety,
    11 - checkIn.mood,
    11 - checkIn.sleepQuality,
    11 - checkIn.energy,
    11 - checkIn.socialConnection,
    11 - checkIn.dailyFunctioning,
  ];

  const sum = distressIndicators.reduce((acc, v) => acc + v, 0);
  const avg = sum / distressIndicators.length; // Range 1 to 10
  // Normalize to 0 - 100 scale: (avg - 1) / 9 * 100
  const normalized = Math.round(((avg - 1) / 9) * 100);
  return Math.max(0, Math.min(100, normalized));
}

function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function calculateVariance(numbers: number[]): number {
  if (numbers.length < 2) return 0;
  const mean = calculateMean(numbers);
  return numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (numbers.length - 1);
}

function calculateMetricSummary(
  currentVals: number[],
  prevVals: number[],
  invertDirectionForDistress = false
): TrendMetricSummary {
  const currentMean = Math.round(calculateMean(currentVals) * 10) / 10;
  const previousMean = Math.round(calculateMean(prevVals) * 10) / 10;
  const absoluteChange = Math.round((currentMean - previousMean) * 10) / 10;
  
  const percentChange = previousMean === 0 
    ? 0 
    : Math.round(((currentMean - previousMean) / previousMean) * 100 * 10) / 10;

  let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
  const effectiveChange = invertDirectionForDistress ? -absoluteChange : absoluteChange;

  if (effectiveChange > 0.6) direction = 'increasing';
  else if (effectiveChange < -0.6) direction = 'decreasing';

  return {
    currentMean,
    previousMean,
    absoluteChange,
    percentChange,
    direction
  };
}

export function analyzeTrends(checkIns: CheckIn[], targetDays = 14): LongitudinalAnalysis {
  if (checkIns.length < 2) {
    const defaultMetric: TrendMetricSummary = {
      currentMean: checkIns[0]?.mood ?? 5,
      previousMean: 5,
      absoluteChange: 0,
      percentChange: 0,
      direction: 'stable'
    };
    return {
      daysAnalyzed: targetDays,
      dataPointsCount: checkIns.length,
      missingDataRate: checkIns.length === 0 ? 1 : 0.8,
      trendDirection: 'INSUFFICIENT_DATA',
      compositeDistressMean: checkIns[0] ? computeCheckInDistressScore(checkIns[0]) : 50,
      compositeDistressPrevious: 50,
      metrics: {
        mood: defaultMetric,
        stress: defaultMetric,
        anxiety: defaultMetric,
        sleepQuality: defaultMetric,
        energy: defaultMetric,
        socialConnection: defaultMetric,
        dailyFunctioning: defaultMetric
      },
      mostChangedIndicators: [],
      persistence: 'low',
      volatility: 'stable'
    };
  }

  // Sort descending by date
  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const halfWindow = Math.max(1, Math.floor(sorted.length / 2));
  const currentSlice = sorted.slice(0, halfWindow);
  const previousSlice = sorted.slice(halfWindow, halfWindow * 2);

  // If previousSlice is empty, fall back to current
  const compPrevious = previousSlice.length > 0 ? previousSlice : currentSlice;

  const distressScoresCurrent = currentSlice.map(computeCheckInDistressScore);
  const distressScoresPrev = compPrevious.map(computeCheckInDistressScore);

  const currentDistressMean = Math.round(calculateMean(distressScoresCurrent));
  const prevDistressMean = Math.round(calculateMean(distressScoresPrev));
  const distressDiff = currentDistressMean - prevDistressMean;

  // Volatility based on variance
  const variance = calculateVariance(sorted.map(computeCheckInDistressScore));
  let volatility: 'stable' | 'moderate' | 'high' = 'stable';
  if (variance > 250) volatility = 'high';
  else if (variance > 100) volatility = 'moderate';

  // Persistence (if elevated distress persists over multiple readings)
  const elevatedCount = currentSlice.filter(c => computeCheckInDistressScore(c) >= 60).length;
  let persistence: 'low' | 'moderate' | 'persistent' = 'low';
  if (elevatedCount >= 3) persistence = 'persistent';
  else if (elevatedCount >= 1) persistence = 'moderate';

  // Overall direction
  let trendDirection: TrendDirection = 'STABLE';
  if (sorted.length < 3) {
    trendDirection = 'INSUFFICIENT_DATA';
  } else if (volatility === 'high' && Math.abs(distressDiff) < 10) {
    trendDirection = 'VOLATILE';
  } else if (distressDiff >= 8) {
    trendDirection = 'INCREASING';
  } else if (distressDiff <= -8) {
    trendDirection = 'IMPROVING';
  }

  const metrics = {
    mood: calculateMetricSummary(currentSlice.map(c => c.mood), compPrevious.map(c => c.mood), true),
    stress: calculateMetricSummary(currentSlice.map(c => c.stress), compPrevious.map(c => c.stress), false),
    anxiety: calculateMetricSummary(currentSlice.map(c => c.anxiety), compPrevious.map(c => c.anxiety), false),
    sleepQuality: calculateMetricSummary(currentSlice.map(c => c.sleepQuality), compPrevious.map(c => c.sleepQuality), true),
    energy: calculateMetricSummary(currentSlice.map(c => c.energy), compPrevious.map(c => c.energy), true),
    socialConnection: calculateMetricSummary(currentSlice.map(c => c.socialConnection), compPrevious.map(c => c.socialConnection), true),
    dailyFunctioning: calculateMetricSummary(currentSlice.map(c => c.dailyFunctioning), compPrevious.map(c => c.dailyFunctioning), true),
  };

  // Find most changed indicators
  const changes = [
    { name: 'Stress', change: Math.abs(metrics.stress.absoluteChange) },
    { name: 'Anxiety', change: Math.abs(metrics.anxiety.absoluteChange) },
    { name: 'Mood', change: Math.abs(metrics.mood.absoluteChange) },
    { name: 'Sleep', change: Math.abs(metrics.sleepQuality.absoluteChange) },
    { name: 'Energy', change: Math.abs(metrics.energy.absoluteChange) },
    { name: 'Social Connection', change: Math.abs(metrics.socialConnection.absoluteChange) },
    { name: 'Functioning', change: Math.abs(metrics.dailyFunctioning.absoluteChange) },
  ].sort((a, b) => b.change - a.change);

  const mostChanged = changes.filter(c => c.change >= 1.0).map(c => c.name);

  const missingRate = Math.max(0, Math.min(1, 1 - (sorted.length / targetDays)));

  return {
    daysAnalyzed: targetDays,
    dataPointsCount: sorted.length,
    missingDataRate: Math.round(missingRate * 100) / 100,
    trendDirection,
    compositeDistressMean: currentDistressMean,
    compositeDistressPrevious: prevDistressMean,
    metrics,
    mostChangedIndicators: mostChanged,
    persistence,
    volatility
  };
}
