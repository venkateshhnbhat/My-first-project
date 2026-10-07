import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Activity, 
  LineChart, 
  ArrowRight, 
  Lock, 
  Compass, 
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white p-8 sm:p-12 md:p-16 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-500/30 text-teal-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Trauma-Informed • Privacy-Preserving • Non-Diagnostic
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Dynamic Mental Health Monitoring & Early Distress Detection
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A voluntary, secure platform designed to help you track changes in stress, mood, sleep, and emotional indicators over time. 
            Identify shifts before they become crises, with actionable, compassionate guidance.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
              >
                Go to Your Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
                >
                  Start Voluntary Check-In <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition"
                >
                  Sign In
                </Link>
              </>
            )}
            <Link
              to="/emergency-support"
              className="inline-flex items-center gap-2 px-5 py-3 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/50 font-medium rounded-xl transition"
            >
              <PhoneCall className="w-4 h-4 text-rose-400" />
              Crisis Resources
            </Link>
          </div>

          {/* Core Philosophy Badge */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>No Medical Diagnoses Ever Made</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Deterministic Longitudinal Math</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Full Data Export & Instant Deletion</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Pipeline */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Dynamic Distress Monitoring Works
          </h2>
          <p className="text-slate-600 text-sm">
            We prioritize longitudinal trend changes rather than one-time labels. A single bad day does not define your trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900">Voluntary Check-Ins</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rate mood, stress, anxiety, sleep, energy, and social connection on a simple 1–10 scale. Optional private journal entries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900">Trend Calculation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mathematical algorithms compute moving averages, variance, persistence, and percentage changes across 3, 7, and 14 days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900">Risk Categorization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distress levels (Low, Moderate, High, Urgent Support) are estimated using strict non-diagnostic thresholds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
              4
            </div>
            <h3 className="font-bold text-slate-900">Support & Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive gentle self-care steps, recommendations to reach out to trusted friends, or links to verified crisis care.
            </p>
          </div>
        </div>
      </section>

      {/* Trauma-Informed Privacy Principles */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 text-teal-800">
            <Lock className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Built on Dignity, Autonomy & Strict Privacy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
            <div className="space-y-2 bg-white p-5 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600" /> No Traumatic Disclosures Required
              </h4>
              <p className="text-xs text-slate-600">
                You never need to describe past traumatic events or atrocities to use distress monitoring. Numeric indicators measure present coping state.
              </p>
            </div>

            <div className="space-y-2 bg-white p-5 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Row-Level Security Isolation
              </h4>
              <p className="text-xs text-slate-600">
                Every record is locked by PostgreSQL Row Level Security (RLS). Nobody else can view or query your check-ins or reflections.
              </p>
            </div>

            <div className="space-y-2 bg-white p-5 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" /> Non-Diagnostic Screening
              </h4>
              <p className="text-xs text-slate-600">
                The platform describes changes in self-reported indicators (e.g. "Reported stress increased +25%") and never assigns clinical labels.
              </p>
            </div>

            <div className="space-y-2 bg-white p-5 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-600" /> Human-in-the-Loop Priority
              </h4>
              <p className="text-xs text-slate-600">
                When elevated distress is detected, the system immediately prioritizes trusted human connections, counselors, and emergency hotlines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
