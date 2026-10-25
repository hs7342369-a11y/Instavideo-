/**
 * Safety, Privacy & Account Settings Modal
 * Implements 2FA, Private account toggle, offensive comment filter,
 * blocked accounts management, data export archive, and community guidelines.
 */
import React, { useState } from 'react';
import {
  X, Shield, Lock, EyeOff, Ban, KeyRound, Download,
  Trash2, Globe, Check, AlertTriangle, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen, setIsSettingsModalOpen, currentUser,
    updateCurrentUserProfile, language, setLanguage,
    blockedUserIds, unblockUser, t
  } = useApp();

  const [activeSection, setActiveSection] = useState<'privacy' | 'security' | 'blocked' | 'guidelines' | 'data'>('privacy');
  const [filterOffensiveComments, setFilterOffensiveComments] = useState(true);
  const [allowTagsFrom, setAllowTagsFrom] = useState<'everyone' | 'following'>('everyone');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataExportRequested, setDataExportRequested] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isSettingsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={() => setIsSettingsModalOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-rose-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Safety, Privacy & Settings
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'privacy', label: 'Privacy & Comments' },
            { id: 'security', label: 'Security & 2FA' },
            { id: 'blocked', label: `Blocked (${blockedUserIds.length})` },
            { id: 'guidelines', label: 'Guidelines' },
            { id: 'data', label: 'Data & Account' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeSection === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section 1: Privacy & Comments */}
        {activeSection === 'privacy' && (
          <div className="space-y-4 text-xs">
            {/* Private Account */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Private Account</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  When enabled, only approved followers can see your photos, reels, and stories.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentUser.isPrivate}
                onChange={e => updateCurrentUserProfile({ isPrivate: e.target.checked })}
                className="w-4 h-4 accent-rose-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Offensive Comments Filter */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Hide Inappropriate & Spam Comments</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Automatically hide hateful or abusive comments using Instavideo AI moderation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={filterOffensiveComments}
                onChange={e => setFilterOffensiveComments(e.target.checked)}
                className="w-4 h-4 accent-rose-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Tag Permissions */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <p className="font-bold text-white">Who can tag or mention you in posts?</p>
              <div className="flex items-center gap-4 text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tags"
                    checked={allowTagsFrom === 'everyone'}
                    onChange={() => setAllowTagsFrom('everyone')}
                    className="accent-rose-500"
                  />
                  <span>Everyone</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tags"
                    checked={allowTagsFrom === 'following'}
                    onChange={() => setAllowTagsFrom('following')}
                    className="accent-rose-500"
                  />
                  <span>People You Follow</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Security & 2FA */}
        {activeSection === 'security' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Require an OTP code sent via SMS or Authenticator App on new logins.
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={e => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 accent-rose-500 cursor-pointer shrink-0"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <p className="font-bold text-white">Login Sessions & Device Management</p>
              <p className="text-[11px] text-zinc-400">
                Current active device: Android Pixel 9 Pro (Mumbai, India) · Active Now
              </p>
            </div>
          </div>
        )}

        {/* Section 3: Blocked Users */}
        {activeSection === 'blocked' && (
          <div className="space-y-3 text-xs">
            {blockedUserIds.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No blocked accounts on your profile.
              </div>
            ) : (
              blockedUserIds.map(id => (
                <div
                  key={id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                >
                  <span className="text-white font-medium">User ID: {id}</span>
                  <button
                    onClick={() => unblockUser(id)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer"
                  >
                    Unblock
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Section 4: Community Guidelines */}
        {activeSection === 'guidelines' && (
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-400" />
              Instavideo Community Standards
            </h4>
            <p>
              1. <strong>Authentic Expression</strong>: No coordinated inauthentic behavior, bots, or artificial view boosting.
            </p>
            <p>
              2. <strong>Zero Tolerance for Harassment</strong>: Hate speech, defamation, cyberbullying, and unconsented media will result in immediate permanent account suspension.
            </p>
            <p>
              3. <strong>Copyright Protection</strong>: Creators retain full IP over original media. DMCA takedown requests are investigated within 24 hours.
            </p>
          </div>
        )}

        {/* Section 5: Data & Account */}
        {activeSection === 'data' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-400" />
                Download Account Archive (GDPR / Indian DPDP Act)
              </p>
              <p className="text-[11px] text-zinc-400">
                Export a copy of all your photos, reels, comments, followers, and earnings records in JSON/ZIP format.
              </p>
              <button
                onClick={() => {
                  setDataExportRequested(true);
                  setTimeout(() => setDataExportRequested(false), 3000);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold cursor-pointer"
              >
                {dataExportRequested ? 'Archive Request Queued ✓' : 'Request Data Export'}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <p className="font-bold text-red-400 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Delete or Deactivate Account
              </p>
              <p className="text-[11px] text-zinc-400">
                Permanently purge your profile, uploads, and earnings. This action cannot be reversed.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-semibold cursor-pointer"
              >
                {showDeleteConfirm ? 'Confirm Account Deletion' : 'Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
