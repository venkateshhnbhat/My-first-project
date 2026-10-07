import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HelpCircle, 
  PhoneCall, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Search, 
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { resources } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = resources.filter(r => {
    const matchesType = filterType === 'all' || r.resourceType === filterType;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-teal-600" />
          Verified Support & Crisis Directory
        </h1>
        <p className="text-xs text-slate-500">
          Curated, confidential mental health resources, free listening lines, and survivor support networks
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search resources by name or focus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'crisis_hotline', label: 'Hotlines' },
            { id: 'text_line', label: 'Text Lines' },
            { id: 'organization', label: 'Organizations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterType === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Verified Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((res) => (
          <div
            key={res.id}
            className={`bg-white rounded-2xl p-6 border shadow-sm space-y-4 flex flex-col justify-between ${
              res.isEmergency ? 'border-rose-200/80 bg-rose-50/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{res.name}</h3>
                {res.isEmergency && (
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full uppercase">
                    Immediate Crisis
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {res.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {res.availableHours}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {res.countryCode}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {res.phone && (
                  <a
                    href={`tel:${res.phone.replace(/[^0-9]/g, '')}`}
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    {res.phone}
                  </a>
                )}
                {res.website && (
                  <a
                    href={res.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
