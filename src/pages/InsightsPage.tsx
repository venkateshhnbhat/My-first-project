import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyzeTrends, computeCheckInDistressScore } from '../services/trendEngine';
import { 
  LineChart as LineChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle, 
  Calendar,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const InsightsPage: React.FC = () => {
  const { checkIns } = useAuth();
  const [selectedWindow, setSelectedWindow] = useState<number>(14);

  const trend = analyzeTrends(checkIns, selectedWindow);

  const chartData = [...checkIns]
    .slice(0, selectedWindow)
    .reverse()
    .map(c => ({
      date: c.date.split('-').slice(1).join('/'),
      Distress: computeCheckInDistressScore(c),
      Mood: c.mood,
      Stress: c.stress,
      Anxiety: c.anxiety,
      Sleep: c.sleepQuality,
      Energy: c.energy,
      Social: c.socialConnection,
      Functioning: c.dailyFunctioning
    }));

  const metricsList = [
    { key: 'stress', name: 'Stress', summary: trend.metrics.stress, alertHigh: true },
    { key: 'anxiety', name: 'Anxiety', summary: trend.metrics.anxiety, alertHigh: true },
    { key: 'mood', name: 'Mood', summary: trend.metrics.mood, alertHigh: false },
    { key: 'sleepQuality', name: 'Sleep Quality', summary: trend.metrics.sleepQuality, alertHigh: false },
    { key: 'energy', name: 'Energy', summary: trend.metrics.energy, alertHigh: false },
    { key: 'socialConnection', name: 'Social Connection', summary: trend.metrics.socialConnection, alertHigh: false },
    { key: 'dailyFunctioning', name: 'Daily Functioning', summary: trend.metrics.dailyFunctioning, alertHigh: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-6 h-6 text-teal-600" />
            Longitudinal Trend Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Mathematically calculated indicator drift, percentage shifts, and volatility analysis
          </p>
        </div>

        {/* Observation Window Selector */}
        <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedWindow(days)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedWindow === days
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Primary Trend Trajectory Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Overall Trajectory
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">
              {trend.trendDirection.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persistence: <span className="font-semibold text-slate-700 capitalize">{trend.persistence}</span>
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Current vs Prior Mean
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{trend.compositeDistressMean}</span>
            <span className="text-xs text-slate-400">vs {trend.compositeDistressPrevious} prior</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Diff: {trend.compositeDistressMean - trend.compositeDistressPrevious > 0 ? '+' : ''}
            {trend.compositeDistressMean - trend.compositeDistressPrevious} pts
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Data Completeness
          </span>
          <div className="text-2xl font-extrabold text-slate-900">
            {Math.round((1 - trend.missingDataRate) * 100)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {trend.dataPointsCount} of {selectedWindow} days logged
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Primary Drifting Factor
          </span>
          <div className="text-base font-bold text-amber-700 truncate">
            {trend.mostChangedIndicators[0] || 'None (Stable)'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secondary: {trend.mostChangedIndicators[1] || 'None'}
          </p>
        </div>
      </div>

      {/* Multi-indicator Comparison Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Multi-Indicator Longitudinal Trajectory (1-10 Scale)
          </h2>
          <span className="text-xs text-slate-500">Observation window: {selectedWindow} days</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Stress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Anxiety" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Mood" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Sleep" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Energy" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Indicator Drift Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Indicator Drift & Percentage Change Breakdown
          </h3>
          <span className="text-xs text-slate-400">Deterministic window arithmetic</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Indicator</th>
                <th className="px-6 py-3">Recent Average</th>
                <th className="px-6 py-3">Prior Baseline</th>
                <th className="px-6 py-3">Absolute Shift</th>
                <th className="px-6 py-3">Percent Change</th>
                <th className="px-6 py-3">Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {metricsList.map((m) => {
                const isIncreasingDistress = m.summary.direction === 'increasing';
                return (
                  <tr key={m.key} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{m.name}</td>
                    <td className="px-6 py-3.5 font-mono">{m.summary.currentMean} / 10</td>
                    <td className="px-6 py-3.5 font-mono text-slate-500">{m.summary.previousMean} / 10</td>
                    <td className="px-6 py-3.5 font-mono">
                      {m.summary.absoluteChange > 0 ? `+${m.summary.absoluteChange}` : m.summary.absoluteChange}
                    </td>
                    <td className="px-6 py-3.5 font-mono">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        isIncreasingDistress ? 'text-amber-700' : 'text-teal-700'
                      }`}>
                        {m.summary.percentChange > 0 ? `+${m.summary.percentChange}%` : `${m.summary.percentChange}%`}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        m.summary.direction === 'increasing'
                          ? 'bg-amber-50 text-amber-800'
                          : m.summary.direction === 'decreasing'
                          ? 'bg-teal-50 text-teal-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.summary.direction.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
