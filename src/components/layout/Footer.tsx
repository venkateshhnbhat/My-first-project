import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Safety Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">AuraCare Distress Monitor</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A privacy-first, trauma-informed digital tool designed to help individuals voluntarily monitor shifts in self-reported distress over time and receive non-diagnostic early supportive guidance.
            </p>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              Zero commercial ad tracking • Strict Row-Level Security • Client Data Sovereignty
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/check-in" className="hover:text-white transition">Daily Check-In</Link></li>
              <li><Link to="/insights" className="hover:text-white transition">Longitudinal Trends</Link></li>
              <li><Link to="/journal" className="hover:text-white transition">Reflective Journal</Link></li>
              <li><Link to="/resources" className="hover:text-white transition">Support Directory</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Safety & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/emergency-support" className="text-rose-400 hover:text-rose-300 font-medium transition flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Emergency 24/7</Link></li>
              <li><Link to="/privacy-settings" className="hover:text-white transition">Data & Consent Management</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Scope</Link></li>
            </ul>
          </div>
        </div>

        {/* Critical Safety Notice Box */}
        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-semibold text-amber-300 block">Critical Clinical & Safety Disclaimer:</span>
            <p>
              AuraCare is an early-warning screening and longitudinal monitoring application, <strong>not a medical diagnostic tool</strong>. 
              The application does not diagnose clinical conditions (including depression, PTSD, or anxiety disorders) and is not a substitute for professional mental healthcare, clinical diagnosis, or emergency psychiatric intervention. 
              If you are in immediate distress or danger, please contact local emergency authorities or call/text <strong>988</strong> immediately.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 pt-4 gap-2">
            <span>© {new Date().getFullYear()} AuraCare Dynamic Mental Health Monitoring. Built for survivor dignity and safety.</span>
            <span>Informed Consent v1.0 • TLS 1.3 / RLS Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
