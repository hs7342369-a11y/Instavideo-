/**
 * Secure Admin Operations & Content Moderation Panel
 * Features role-based moderation queue, user bans/restorations, verification
 * badge approvals, payout transaction oversight, commission configuration, and audit logs.
 */
import React, { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Users, DollarSign,
  Settings, Activity, Eye, Trash2, Ban, RefreshCw, Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const {
    users, adminReports, verificationRequests, payoutRecords,
    adminResolveReport, adminApproveVerification, adminToggleUserStatus, t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'verification' | 'users' | 'payouts' | 'settings'>('reports');
  const [platformCommission, setPlatformCommission] = useState(15);
  const [adminActionLogs, setAdminActionLogs] = useState<string[]>([
    'Admin approved verification for @chef_vikram',
    'Platform commission updated to 15%',
    'Automated spam heuristic cleared 14 bot accounts',
  ]);

  const addLog = (log: string) => {
    setAdminActionLogs(prev => [log, ...prev]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 pt-2 px-2 sm:px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              {t('admin', 'title')}
            </h1>
            <p className="text-xs text-zinc-400">
              Role-Based Access Control · Root SuperAdmin Clearance
            </p>
          </div>
        </div>

        {/* Global Security Health Ticker */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Health Status</span>
            <span className="text-emerald-400 font-semibold">100% Secure & Operational</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'reports', label: `${t('admin', 'reportsTab')} (${adminReports.filter(r => r.status === 'pending').length})`, icon: AlertTriangle },
          { id: 'verification', label: `${t('admin', 'verifyTab')} (${verificationRequests.filter(v => v.status === 'pending').length})`, icon: CheckCircle },
          { id: 'users', label: t('admin', 'usersTab'), icon: Users },
          { id: 'payouts', label: t('admin', 'payoutsTab'), icon: DollarSign },
          { id: 'settings', label: t('admin', 'settingsTab'), icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-[2px] cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-rose-500 text-white'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-rose-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Reported Content Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Moderation Queue: Pending Community Flagged Items</span>
          </div>

          <div className="space-y-3">
            {adminReports.map(report => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                      {report.reason}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Reported by {report.reporterName} · {report.timestamp}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-200">{report.targetContent}</p>
                  <p className="text-[10px] text-zinc-500">Target ID: {report.targetId} ({report.targetType})</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {report.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => {
                          adminResolveReport(report.id, 'dismiss');
                          addLog(`Report ${report.id} dismissed as false flag.`);
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        {t('admin', 'actionDismissReport')}
                      </button>
                      <button
                        onClick={() => {
                          adminResolveReport(report.id, 'ban_content');
                          addLog(`Content ${report.targetId} removed for ${report.reason}`);
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {t('admin', 'actionRemoveContent')}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 capitalize">
                      {report.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Verification Badge Approvals */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {verificationRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-white">@{req.username}</p>
                  <p className="text-xs text-zinc-400">
                    Category: {req.category} · Supporting Docs: {req.documentType}
                  </p>
                  <span className="text-[10px] text-zinc-500">Requested: {req.requestDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <button
                      onClick={() => {
                        adminApproveVerification(req.id);
                        addLog(`Verified badge approved for @${req.username}`);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {t('admin', 'actionVerify')}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">Badge Active ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Followers</th>
                  <th className="p-3">Monetization</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-zinc-800/30">
                    <td className="p-3 flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.username}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-white block">@{u.username}</span>
                        <span className="text-[10px] text-zinc-500">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold uppercase text-[10px] text-zinc-400">
                      {u.role}
                    </td>
                    <td className="p-3 tabular-nums">{u.followersCount.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.monetizationEnabled
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {u.monetizationEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          adminToggleUserStatus(u.id);
                          addLog(`Toggled status for @${u.username}`);
                        }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Payout Transactions */}
      {activeTab === 'payouts' && (
        <div className="space-y-3">
          <div className="overflow-x-auto bg-zinc-900/60 border border-zinc-800 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Account Details</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {payoutRecords.map(pay => (
                  <tr key={pay.id}>
                    <td className="p-3 font-mono">{pay.id}</td>
                    <td className="p-3 font-medium text-white">{pay.accountDetails}</td>
                    <td className="p-3 font-bold text-emerald-400">${pay.amountUSD} (₹{pay.amountINR})</td>
                    <td className="p-3">{pay.paymentMethod}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Platform Settings & Commission */}
      {activeTab === 'settings' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-white">Platform Commission & Revenue Policy</h3>

          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-between text-xs">
              <label className="text-zinc-300 font-medium">
                {t('admin', 'commissionRate')}: {platformCommission}%
              </label>
              <span className="text-emerald-400 font-bold">
                Creator Keeps {100 - platformCommission}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={platformCommission}
              onChange={e => {
                setPlatformCommission(parseInt(e.target.value));
                addLog(`Platform commission adjusted to ${e.target.value}%`);
              }}
              className="w-full accent-rose-500"
            />
            <p className="text-[11px] text-zinc-500">
              Industry standard: Instavideo maintains a creator-first 85/15 model for subscriptions and 55/45 for video in-stream advertising.
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-xs font-bold text-white mb-2">Audit Action Logs</h4>
            <div className="space-y-1.5 font-mono text-[11px] text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              {adminActionLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
