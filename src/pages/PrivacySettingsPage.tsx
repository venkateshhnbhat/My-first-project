import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  FileCheck, 
  RefreshCw 
} from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  const { user, exportData, deleteAccount, updateConsent } = useAuth();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleWithdrawConsent = async () => {
    if (window.confirm('Withdrawing consent will disable active distress monitoring until consent is restored. Proceed?')) {
      await updateConsent(false);
      navigate('/consent');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmationText.trim().toLowerCase() !== 'delete') return;
    await deleteAccount();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          Data Sovereignty & Privacy Controls
        </h1>
        <p className="text-xs text-slate-500">
          You have absolute ownership and control over your voluntary mental health data
        </p>
      </div>

      {/* Informed Consent Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-teal-600" />
            Informed Consent Status
          </h2>
          <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded-full">
            Active ({user?.consentVersion || 'v1.0-2025'})
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Consent granted on: <strong>{user?.consentDate ? new Date(user.consentDate).toLocaleDateString() : 'Active'}</strong>.
          You may withdraw consent at any time, which pauses active distress monitoring.
        </p>

        <div className="pt-2">
          <button
            onClick={handleWithdrawConsent}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Withdraw Consent & Return to Safety Agreement
          </button>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-teal-600" />
            Export Your Personal Records
          </h2>
          <span className="text-xs text-slate-400">JSON Format</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Download a complete, machine-readable JSON copy of all your check-in ratings, timestamps, and model estimates.
        </p>

        <div>
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Download Full Data Archive (JSON)
          </button>
        </div>
      </div>

      {/* Account Deletion / Data Purge */}
      <div className="bg-rose-50/60 rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
          <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            Permanent Account & Data Deletion
          </h2>
          <span className="text-xs font-semibold text-rose-600">Irreversible Action</span>
        </div>

        <p className="text-xs text-rose-900 leading-relaxed">
          Permanently purge your account, all check-in entries, distress indices, and journal reflections from the database. 
          Once executed, this action cannot be undone.
        </p>

        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            Request Full Account & Data Purge
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Confirm Irreversible Deletion</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will immediately delete your user record and cascade delete all associated check-ins and assessments. 
              To confirm, please type <strong>DELETE</strong> below:
            </p>

            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-mono uppercase focus:ring-2 focus:ring-rose-500 outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText.trim().toLowerCase() !== 'delete'}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-40 transition"
              >
                Permanently Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
