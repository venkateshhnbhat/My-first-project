import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeTrends, computeCheckInDistressScore } from '../services/trendEngine';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Smile, 
  Zap, 
  Moon, 
  Heart, 
  Users, 
  Activity,
  PhoneCall,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, checkIns, assessments } = useAuth();

  const latestCheckIn = checkIns[0];
  const latestAssessment = assessments[0];
  const trendAnalysis = analyzeTrends(checkIns, 14);

  // Format historical chart data
  const chartData = [...checkIns]
    .slice(0, 14)
    .reverse()
    .map(c => ({
      date: c.date.split('-').slice(1).join('/'),
      Distress: computeCheckInDistressScore(c),
      Mood: c.mood,
      Stress: c.stress,
      Anxiety: c.anxiety,
      Sleep: c.sleepQuality
    }));

  const getRiskBadge = (level: string = 'LOW') => {
    switch (level) {
      case 'URGENT_SUPPORT':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
          label: 'Immediate Support Recommended'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          label: 'Elevated Distress Pattern'
        };
      case 'MODERATE':
        return {
          bg: 'bg-sky-100 text-sky-900 border-sky-300',
          dot: 'bg-sky-600',
          label: 'Moderate Fluctuations'
        };
      default:
        return {
          bg: 'bg-teal-100 text-teal-900 border-teal-300',
          dot: 'bg-teal-600',
          label: 'Low / Stable Distress'
        };
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'INCREASING':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case 'IMPROVING':
        return <TrendingDown className="w-4 h-4 text-teal-600" />;
      case 'VOLATILE':
        return <Activity className="w-4 h-4 text-purple-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const riskBadge = getRiskBadge(latestAssessment?.riskLevel);

  return (
    <div className="space-y-8">
      {/* Top Greeting & Daily Check-In Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || 'Friend'}
            </h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded-full">
              Day {checkIns.length} of Voluntary Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Longitudinal trend monitoring active • Last check-in recorded on {latestCheckIn?.date || 'None'}
          </p>
        </div>

        <Link
          to="/check-in"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Record Today's Check-In
        </Link>
      </div>

      {/* Primary Status Banner: Non-diagnostic Risk & Trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Distress Risk Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Screening Category
            </span>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${riskBadge.dot}`}></span>
              {riskBadge.label}
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {latestAssessment?.distressScore ?? computeCheckInDistressScore(latestCheckIn)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100 Composite Distress Index</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {latestAssessment?.summary || 'Your recent responses indicate stable coping and balanced indicators.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Confidence: {latestAssessment?.confidenceScore || 85}%</span>
            <Link to="/insights" className="text-teal-600 font-semibold hover:underline inline-flex items-center gap-1">
              View Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Longitudinal Trend Direction */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              14-Day Trajectory
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
              {getTrendIcon(trendAnalysis.trendDirection)}
              <span>{trendAnalysis.trendDirection.replace('_', ' ')}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Recent Distress Mean:</span>
                <span className="font-semibold text-slate-900">{trendAnalysis.compositeDistressMean} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Prior Baseline Mean:</span>
                <span className="font-semibold text-slate-900">{trendAnalysis.compositeDistressPrevious} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Primary Shifting Factor:</span>
                <span className="font-semibold text-amber-700">
                  {trendAnalysis.mostChangedIndicators[0] || 'None (Stable)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Analyzed across {checkIns.length} recorded entries</span>
          </div>
        </div>

        {/* Card 3: Support Action Reminder */}
        <div className="bg-gradient-to-br from-teal-50 to-sky-50 p-6 rounded-2xl border border-teal-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Recommended Next Step</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {latestAssessment?.recommendations[0]?.title || 'Maintain Supportive Routines'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {latestAssessment?.recommendations[0]?.description || 'Consistent sleep schedules and gentle rest support baseline balance.'}
            </p>
          </div>

          <div className="pt-3 border-t border-teal-200/50 flex items-center justify-between">
            <Link
              to="/resources"
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1"
            >
              Browse Support Resources <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Longitudinal Charts & Recent Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Distress Trajectory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Composite Distress Trend (Last 14 Observations)
              </h2>
              <p className="text-xs text-slate-500">
                Standardized 0–100 distress index derived from multi-indicator ratings
              </p>
            </div>
            <span className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
              Lower is more calm
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="distressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Distress"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#distressGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Composite Distress
              </span>
            </div>
            <Link to="/history" className="text-teal-600 font-medium hover:underline">
              View Full History Table
            </Link>
          </div>
        </div>

        {/* Latest Check-In Snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Latest Ratings Snapshot</h3>
            <span className="text-xs text-slate-500">{latestCheckIn?.date}</span>
          </div>

          {latestCheckIn ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5"><Smile className="w-3.5 h-3.5 text-teal-600" /> Mood</span>
                  <span className="font-semibold text-slate-900">{latestCheckIn.mood} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${latestCheckIn.mood * 10}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-amber-600" /> Stress</span>
                  <span className="font-semibold text-slate-900">{latestCheckIn.stress} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${latestCheckIn.stress * 10}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-indigo-600" /> Anxiety</span>
                  <span className="font-semibold text-slate-900">{latestCheckIn.anxiety} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${latestCheckIn.anxiety * 10}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-sky-600" /> Sleep Quality</span>
                  <span className="font-semibold text-slate-900">{latestCheckIn.sleepQuality} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${latestCheckIn.sleepQuality * 10}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-emerald-600" /> Energy</span>
                  <span className="font-semibold text-slate-900">{latestCheckIn.energy} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${latestCheckIn.energy * 10}%` }}></div>
                </div>
              </div>

              {latestCheckIn.journalText && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600">
                  <span className="font-medium text-slate-800 block mb-0.5">Journal Note:</span>
                  <p className="line-clamp-2 italic">"{latestCheckIn.journalText}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No check-in recorded yet.</p>
              <Link to="/check-in" className="text-teal-600 font-medium hover:underline block">
                Record your first check-in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Contributing Factors & Early Warning Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contributing Factors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Key Factors Contributing to Distress Score
          </h3>

          {latestAssessment?.contributingFactors && latestAssessment.contributingFactors.length > 0 ? (
            <div className="space-y-3">
              {latestAssessment.contributingFactors.map((factor, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{factor.factor}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      factor.severity === 'elevated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {factor.severity}
                    </span>
                  </div>
                  <p className="text-slate-600">{factor.evidence}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">
              No significant elevated factors detected across recent responses.
            </div>
          )}
        </div>

        {/* Supportive Action Plan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-600" />
            Early Warning Guidance & Supportive Actions
          </h3>

          {latestAssessment?.recommendations && latestAssessment.recommendations.length > 0 ? (
            <div className="space-y-3">
              {latestAssessment.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-teal-950">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{rec.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{rec.description}</p>
                  {rec.actionableSteps && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                      {rec.actionableSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">
              Continue regular self-care routines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
