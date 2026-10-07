import React from 'react';
import { AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Non-Diagnostic Agreement
        </h1>
        <p className="text-xs text-slate-500">
          Clear scope of service, user rights, and clinical limitations
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-950">
          <strong className="block text-amber-900 mb-1">Non-Clinical Screening Disclaimer:</strong>
          AuraCare is an informational tool and does not provide clinical diagnoses, psychotherapy, medication management, or emergency intervention. If you are experiencing suicidal thoughts, contact 988 or emergency services immediately.
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Eligibility & Voluntary Use</h2>
          <p>
            Use of this platform is entirely voluntary. You may stop using the service at any time without penalty or loss of access to previously exported records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. No Autonomous Medical Authority</h2>
          <p>
            The software calculations, moving averages, and generative summaries are advisory guides intended to support personal reflection and discussions with trusted practitioners. They should never be treated as definitive clinical diagnoses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Emergency Situations</h2>
          <p>
            The platform does not monitor incoming check-ins in real time to dispatch law enforcement or emergency teams. In acute crisis or danger, users must utilize the provided direct crisis hotlines or local emergency care.
          </p>
        </section>
      </div>
    </div>
  );
};
