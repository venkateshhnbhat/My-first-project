import React from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  HeartHandshake, 
  Globe, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const EmergencySupportPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-8">
      {/* High-Visibility Emergency Header */}
      <div className="bg-rose-50 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-rose-950">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600 text-white rounded-2xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Immediate Crisis & Emergency Support
            </h1>
            <p className="text-xs sm:text-sm text-rose-800">
              Free, confidential, 24/7 human guidance for anyone experiencing severe distress or danger
            </p>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-900 leading-relaxed">
          If you are in immediate physical danger, feel unable to keep yourself safe, or have thoughts of self-harm, 
          <strong> please connect immediately with a qualified human responder or emergency authority.</strong> 
          AuraCare is an automated screening tool and cannot respond directly to emergencies.
        </div>

        {/* Primary Hotlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white p-5 rounded-2xl border border-rose-200 space-y-2">
            <span className="text-[11px] font-bold uppercase text-rose-600 block">United States & Canada</span>
            <h3 className="font-extrabold text-base text-slate-900">988 Suicide & Crisis Lifeline</h3>
            <p className="text-xs text-slate-600">Available 24 hours a day, 7 days a week. Free and confidential.</p>
            <a
              href="tel:988"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <PhoneCall className="w-4 h-4" /> Call or Text 988
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200 space-y-2">
            <span className="text-[11px] font-bold uppercase text-rose-600 block">Crisis Text Line</span>
            <h3 className="font-extrabold text-base text-slate-900">Text HOME to 741741</h3>
            <p className="text-xs text-slate-600">Free, 24/7 crisis support via text message with a crisis counselor.</p>
            <a
              href="sms:741741?body=HOME"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <PhoneCall className="w-4 h-4" /> Start SMS Conversation
            </a>
          </div>
        </div>
      </div>

      {/* Recommended Grounding Steps */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-teal-600" />
          Immediate Grounding Steps You Can Take Right Now
        </h2>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">1. Reach out to one trusted person</strong>
              You do not have to explain everything. A simple message like: <em>"I'm having a difficult day and need some quiet company or a quick call"</em> is enough.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">2. Change your sensory environment</strong>
              Step into another room, take a slow drink of cold water, wrap in a comforting blanket, or step outside for fresh air.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">3. Regulate breathing (Box Breathing)</strong>
              Inhale for 4 seconds, hold for 4 seconds, exhale slowly for 4 seconds, pause for 4 seconds. Repeat 3 times to soothe physiological panic.
            </div>
          </div>
        </div>
      </div>

      {/* International Directories */}
      <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-600" /> International Helplines
        </h3>
        <p>
          If you are outside North America, please refer to verified international crisis directories:
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Find A Helpline Global <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.befrienders.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Befrienders Worldwide <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
