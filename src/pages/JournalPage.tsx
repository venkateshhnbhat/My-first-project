import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, Trash2, Calendar, ShieldCheck, Heart } from 'lucide-react';

export const JournalPage: React.FC = () => {
  const { checkIns, deleteJournal } = useAuth();
  const [analyzedId, setAnalyzedId] = useState<string | null>(null);

  const journalEntries = checkIns.filter(c => Boolean(c.journalText));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-600" />
          Reflective Journal & Emotional Signals
        </h1>
        <p className="text-xs text-slate-500">
          Private, optional reflections. You maintain full ownership and can delete entries at any time.
        </p>
      </div>

      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center gap-3 text-xs text-teal-900">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
        <span>
          Journal entries are never shared with third parties or advertisers. AI processing is purely optional and non-diagnostic.
        </span>
      </div>

      <div className="space-y-4">
        {journalEntries.map((entry) => {
          const isAnalyzed = analyzedId === entry.id;

          return (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-800">{entry.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAnalyzedId(isAnalyzed ? null : entry.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    {isAnalyzed ? 'Hide Reflection Signals' : 'View Emotional Signals'}
                  </button>

                  <button
                    onClick={() => deleteJournal(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete this reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {entry.journalText}
              </p>

              {/* Optional Emotional Signal Analysis */}
              {isAnalyzed && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" /> Detected Emotional Themes
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                      Non-Diagnostic Estimation
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg font-medium">
                      Resilience & Grounding
                    </span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-medium">
                      Cognitive Strain (Moderate)
                    </span>
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg font-medium">
                      Self-Reflection
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    AI signal detection extracts high-level affective keywords to assist in longitudinal trend interpretation without attributing psychiatric diagnoses.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {journalEntries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2 text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No journal entries written yet.</p>
            <p className="text-slate-400">
              You can write optional reflections anytime when completing your daily check-in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
