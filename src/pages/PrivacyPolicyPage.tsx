import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: 2025 • Informed Consent Version v1.0
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Trauma-Informed Data Collection</h2>
          <p>
            AuraCare is purposefully architected to protect vulnerable individuals. We do not require disclosure of trauma narratives, names of perpetrators, or specific incident accounts. All numerical tracking measures present-state indicators (1–10 scale).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Row Level Security & Data Isolation</h2>
          <p>
            Your data is stored in PostgreSQL protected by Row Level Security (RLS). Every database query verifies the authenticated JWT user token. No other user can access, read, or filter your records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Artificial Intelligence Principles</h2>
          <p>
            AI assistance is limited strictly to longitudinal trend organization and non-diagnostic early warning categorization. We never use client mental health logs to train commercial foundational models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Right to Export & Immediate Deletion</h2>
          <p>
            You have the absolute right to export your complete records as standard JSON and permanently purge all stored data via the Privacy Settings page.
          </p>
        </section>
      </div>
    </div>
  );
};
