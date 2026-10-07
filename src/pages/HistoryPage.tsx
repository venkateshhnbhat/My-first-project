import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { computeCheckInDistressScore } from '../services/trendEngine';
import { 
  Calendar, 
  Trash2, 
  Smile, 
  Activity, 
  Zap, 
  Moon, 
  Heart, 
  Users, 
  Briefcase, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { checkIns, deleteCheckIn, deleteJournal } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = checkIns.filter(c => 
    c.date.includes(filterQuery) || 
    (c.journalText && c.journalText.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Check-In History & Log
          </h1>
          <p className="text-xs text-slate-500">
            Review, audit, or delete voluntary historical responses
          </p>
        </div>

        <input
          type="text"
          placeholder="Filter by date or journal text..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="text-xs border border-slate-300 rounded-xl px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item) => {
          const distressScore = computeCheckInDistressScore(item);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {item.date.split('-').slice(1).join('/')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.date}</h3>
                    <span className="text-[11px] text-slate-400">Recorded {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Distress Score</span>
                    <span className="text-sm font-extrabold text-slate-800 font-mono">{distressScore} / 100</span>
                  </div>

                  <button
                    onClick={() => deleteCheckIn(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete this check-in"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid of 7 Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Mood</span>
                  <span className="font-bold text-slate-800">{item.mood} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Stress</span>
                  <span className="font-bold text-slate-800">{item.stress} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Anxiety</span>
                  <span className="font-bold text-slate-800">{item.anxiety} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Sleep</span>
                  <span className="font-bold text-slate-800">{item.sleepQuality} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Energy</span>
                  <span className="font-bold text-slate-800">{item.energy} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Social</span>
                  <span className="font-bold text-slate-800">{item.socialConnection} / 10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Functioning</span>
                  <span className="font-bold text-slate-800">{item.dailyFunctioning} / 10</span>
                </div>
              </div>

              {/* Journal Text */}
              {item.journalText && (
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Optional Journal Entry
                    </span>
                    <button
                      onClick={() => deleteJournal(item.id)}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Delete Entry Only
                    </button>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{item.journalText}"
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2 text-slate-500 text-xs">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No check-in entries found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
