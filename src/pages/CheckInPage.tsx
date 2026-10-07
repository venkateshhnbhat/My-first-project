import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Smile, 
  Activity, 
  Zap, 
  Moon, 
  Heart, 
  Users, 
  Briefcase, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const CheckInPage: React.FC = () => {
  const { addCheckIn } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [socialConnection, setSocialConnection] = useState(5);
  const [dailyFunctioning, setDailyFunctioning] = useState(5);
  const [journalText, setJournalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addCheckIn({
        date,
        mood,
        stress,
        anxiety,
        sleepQuality,
        energy,
        socialConnection,
        dailyFunctioning,
        journalText: journalText.trim() ? journalText.trim() : undefined
      });
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSlider = (
    label: string,
    description: string,
    value: number,
    setValue: (val: number) => void,
    icon: React.ReactNode,
    lowLabel: string,
    highLabel: string,
    colorClass: string
  ) => {
    return (
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-700`}>
              {icon}
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm block">{label}</span>
              <span className="text-[11px] text-slate-500 block">{description}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-lg font-bold text-slate-900">{value}</span>
            <span className="text-[10px] text-slate-400">/ 10</span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600`}
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
          <span>{lowLabel} (1)</span>
          <span>Moderate (5)</span>
          <span>{highLabel} (10)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-8">
      {/* Title */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Daily Distress & Well-Being Check-In
        </h1>
        <p className="text-xs text-slate-500">
          Voluntary 1–10 indicator ratings help track meaningful changes over time
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Date Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <label className="text-xs font-semibold text-slate-700">Check-In Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* 7 Core Indicators */}
        <div className="space-y-4">
          {renderSlider(
            'Overall Mood',
            'How is your general emotional state today?',
            mood,
            setMood,
            <Smile className="w-4 h-4 text-teal-600" />,
            'Very low / Heavy',
            'Very positive / Uplifted',
            'teal'
          )}

          {renderSlider(
            'Perceived Stress',
            'Level of mental strain, pressure, or feeling overwhelmed',
            stress,
            setStress,
            <Activity className="w-4 h-4 text-amber-600" />,
            'Completely calm',
            'Extreme stress',
            'amber'
          )}

          {renderSlider(
            'Anxiety & Nervous Tension',
            'Sensations of dread, restlessness, worry, or racing thoughts',
            anxiety,
            setAnxiety,
            <Zap className="w-4 h-4 text-indigo-600" />,
            'Peaceful / Settled',
            'Severe anxiety / Panic',
            'indigo'
          )}

          {renderSlider(
            'Sleep Quality',
            'How restorative was your sleep last night?',
            sleepQuality,
            setSleepQuality,
            <Moon className="w-4 h-4 text-sky-600" />,
            'Insomnia / Disturbed',
            'Deep / Restful',
            'sky'
          )}

          {renderSlider(
            'Physical & Mental Energy',
            'Your stamina for dealing with today’s demands',
            energy,
            setEnergy,
            <Heart className="w-4 h-4 text-emerald-600" />,
            'Exhausted / Depleted',
            'High stamina / Vital',
            'emerald'
          )}

          {renderSlider(
            'Social Connection',
            'Do you feel supported, heard, or connected to others?',
            socialConnection,
            setSocialConnection,
            <Users className="w-4 h-4 text-purple-600" />,
            'Isolated / Withdrawn',
            'Strongly supported',
            'purple'
          )}

          {renderSlider(
            'Daily Functioning & Tasks',
            'Ability to complete everyday responsibilities, meals, and self-care',
            dailyFunctioning,
            setDailyFunctioning,
            <Briefcase className="w-4 h-4 text-cyan-600" />,
            'Significantly impaired',
            'Fully capable',
            'cyan'
          )}
        </div>

        {/* Optional Journal Section */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Optional Private Reflection
            </label>
            <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
              Optional — only write what you are comfortable sharing
            </span>
          </div>

          <textarea
            rows={4}
            value={journalText}
            maxLength={5000}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write freely if you find it helpful. You never need to describe trauma or difficult details..."
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition resize-none leading-relaxed"
          ></textarea>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Encrypted in PostgreSQL database with Row-Level Security</span>
            <span>{journalText.length} / 5000 chars</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Analyzing & Saving...' : 'Save Check-In'}
          </button>
        </div>
      </form>
    </div>
  );
};
