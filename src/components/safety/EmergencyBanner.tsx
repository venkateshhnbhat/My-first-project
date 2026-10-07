import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, PhoneCall, ArrowRight } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-rose-50 border-b border-rose-200 text-rose-900 px-4 py-2.5 text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">Immediate Support Notice:</span>
          <span className="text-rose-800">
            If you are in immediate physical danger, experiencing crisis, or cannot keep yourself safe, human support is available 24/7.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:988"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-full transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call / Text 988 (US & CA)
          </a>
          <Link
            to="/emergency-support"
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
          >
            All Crisis Resources <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
