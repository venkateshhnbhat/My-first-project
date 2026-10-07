import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  HeartHandshake, 
  Lock, 
  CheckCircle, 
  XCircle,
  HelpCircle
} from 'lucide-react';

export const ConsentPage: React.FC = () => {
  const { user, updateConsent } = useAuth();
  const navigate = useNavigate();

  const [acknowledgedPoints, setAcknowledgedPoints] = useState({
    nonDiagnostic: false,
    voluntary: false,
    emergencyAwareness: false,
    aiLimitations: false,
    dataControl: false
  });

  const allAcknowledged = Object.values(acknowledgedPoints).every(Boolean);

  const handleConsent = async () => {
    if (!allAcknowledged) return;
    await updateConsent(true);
    navigate('/dashboard');
  };

  const handleDecline = async () => {
    await updateConsent(false);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-600 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Informed Consent & Safety Understanding
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Please review and acknowledge each principle before proceeding to the distress monitoring platform.
        </p>
      </div>

      {/* Critical Highlight Alert */}
      <div className="p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl text-amber-950 text-xs sm:text-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Non-Diagnostic Screening Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          AuraCare is an early-warning screening tool that tracks changes in self-reported indicators over time. 
          <strong> It does not provide medical diagnoses, psychiatric evaluations, or clinical determinations.</strong>
          If you are in immediate danger, suicidal distress, or need crisis counseling, you must connect directly with emergency medical or crisis services.
        </p>
      </div>

      {/* Consent Checkpoints */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Terms of Informed Consent (Version v1.0-2025)
        </h2>

        <div className="space-y-4">
          {/* Checkpoint 1 */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={acknowledgedPoints.nonDiagnostic}
              onChange={(e) => setAcknowledgedPoints(prev => ({ ...prev, nonDiagnostic: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                1. Non-Diagnostic Nature
              </span>
              I understand that AuraCare does not diagnose psychiatric conditions (e.g. depression, PTSD, anxiety). Predictions reflect statistical trends in my self-reported numbers and are not clinical facts.
            </div>
          </label>

          {/* Checkpoint 2 */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={acknowledgedPoints.voluntary}
              onChange={(e) => setAcknowledgedPoints(prev => ({ ...prev, voluntary: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                2. Voluntary Participation & Optional Journals
              </span>
              I understand that all check-ins are strictly voluntary. I am never required to disclose traumatic events or write journal entries unless I choose to.
            </div>
          </label>

          {/* Checkpoint 3 */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={acknowledgedPoints.emergencyAwareness}
              onChange={(e) => setAcknowledgedPoints(prev => ({ ...prev, emergencyAwareness: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                3. Crisis & Emergency Protocols
              </span>
              I understand that the platform does not call 911 or emergency services autonomously. In severe distress or immediate danger, I am responsible for reaching out to 988 or local emergency numbers.
            </div>
          </label>

          {/* Checkpoint 4 */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={acknowledgedPoints.aiLimitations}
              onChange={(e) => setAcknowledgedPoints(prev => ({ ...prev, aiLimitations: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                4. AI-Assisted Interpretation Limitations
              </span>
              I understand that AI algorithms assist in organizing longitudinal patterns, but algorithmic estimates can be uncertain and must be considered alongside human judgment.
            </div>
          </label>

          {/* Checkpoint 5 */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={acknowledgedPoints.dataControl}
              onChange={(e) => setAcknowledgedPoints(prev => ({ ...prev, dataControl: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">
                5. Total Data Control & Instant Deletion
              </span>
              I retain full sovereignty over my data. I can download a JSON export, delete individual entries, or completely wipe my account and check-in history at any moment.
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleDecline}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            I Decline / Return Home
          </button>

          <button
            onClick={handleConsent}
            disabled={!allAcknowledged}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Accept & Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
