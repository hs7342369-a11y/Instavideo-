/**
 * Creator Monetization & Earnings Dashboard
 * Implements real revenue models: 55/45 Ad Share, Subscriptions, Virtual Gifts,
 * Bank & UPI Payout Requests, Minimum Thresholds, Tax/Identity Verification,
 * and Platform Compliance Disclaimers.
 */
import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, ShieldCheck, CheckCircle2, AlertCircle,
  CreditCard, ArrowDownRight, Clock, Building2, HelpCircle, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MonetizationDashboard: React.FC = () => {
  const {
    currentUser, monetizationStats, payoutRecords, requestPayout,
    applyForMonetization, t
  } = useApp();

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'PayPal'>('UPI');
  const [accountDetails, setAccountDetails] = useState('rohan.mehta@oksbi');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState(false);

  const formatMoney = (usd: number, inr: number) => {
    if (currency === 'INR') {
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(payoutAmount);
    if (isNaN(amountVal) || amountVal < 50) return;

    requestPayout(amountVal, paymentMethod, accountDetails);
    setShowPayoutModal(false);
    setPayoutSuccessMsg(true);
    setTimeout(() => setPayoutSuccessMsg(false), 3500);
  };

  // Eligibility requirements check
  const eligibility = {
    followersRequired: 10000,
    currentFollowers: currentUser.followersCount,
    followersPassed: currentUser.followersCount >= 10000 || currentUser.monetizationEnabled,
    viewsRequired: 100000,
    currentViews: 240000,
    viewsPassed: true,
    policyViolations: 0,
    guidelinesPassed: true,
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 pt-2 px-2 sm:px-4 space-y-6">
      {/* Header and Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            {t('monetization', 'title')}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time analytics for AdSense, Fan Memberships, and Live Virtual Gifting.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              currency === 'INR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ₹ INR (India)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              currency === 'USD' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            $ USD (Global)
          </button>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('monetization', 'payoutSuccess')}</span>
        </div>
      )}

      {/* Monetization Status Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t('monetization', 'activeStatus')}
              </span>
              <span className="text-xs text-zinc-400">· Tier 1 Partner Program</span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              {t('monetization', 'adSharingTitle')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
        >
          {t('monetization', 'requestPayout')}
        </button>
      </div>

      {/* 3 Metric Cards: Lifetime, This Month, Available Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Available Balance */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 block">
            {t('monetization', 'availablePayout')}
          </span>
          <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
            {formatMoney(currentUser.balanceUSD, currentUser.balanceINR)}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
            <ArrowDownRight className="w-3 h-3 text-emerald-400" />
            Ready for instant UPI transfer
          </span>
        </div>

        {/* This Month Estimated */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 block">
            {t('monetization', 'thisMonth')}
          </span>
          <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
            {formatMoney(monetizationStats.estimatedRevenueUSD, monetizationStats.estimatedRevenueINR)}
          </div>
          <span className="text-[10px] text-zinc-400 pt-1 block">
            RPM: ${monetizationStats.rpm} · CPM: ${monetizationStats.cpm}
          </span>
        </div>

        {/* Ad Impressions & Fans */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 block">
            {t('monetization', 'adRevenue')}
          </span>
          <div className="text-2xl font-bold text-white font-['Outfit'] tabular-nums">
            {monetizationStats.adImpressions.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400 pt-1 block">
            {monetizationStats.subscriberCount} Active Fan Members
          </span>
        </div>
      </div>

      {/* Revenue Stream Breakdown */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Revenue Channels Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">1. Video In-Stream Ads</span>
              <span className="text-emerald-400 font-bold">55% Share</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[65%]" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Generated from short reels and creator long-form videos.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">2. Paid Channel Memberships</span>
              <span className="text-rose-400 font-bold">85% Share</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[45%]" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Recurring monthly tiers (₹199/mo) from loyal community members.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">3. Live Stream Virtual Gifts</span>
              <span className="text-purple-400 font-bold">80% Share</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[30%]" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Diamonds, Roses, and Super Chats sent during live broadcasts.
            </p>
          </div>
        </div>
      </div>

      {/* Program Eligibility Tracker */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Creator Partner Program Criteria</span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Requirements Met
          </span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-300">Audience: 10,000 Followers</span>
            <span className="text-emerald-400 font-semibold tabular-nums">
              {currentUser.followersCount.toLocaleString()} / 10,000 (Passed)
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-300">Public Watch Views: 100,000 Views in last 90 days</span>
            <span className="text-emerald-400 font-semibold tabular-nums">240,000 / 100,000 (Passed)</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-300">Account Safety: Zero active Community Guideline strikes</span>
            <span className="text-emerald-400 font-semibold">Clean Standing</span>
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>{t('monetization', 'payoutHistory')}</span>
          <span className="text-xs text-zinc-400 font-normal">
            Minimum threshold: $50 (₹3,000)
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Transaction ID</th>
                <th className="pb-2 font-medium">Method</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 tabular-nums">
              {payoutRecords.map(pay => (
                <tr key={pay.id} className="text-zinc-300">
                  <td className="py-2.5">{pay.date}</td>
                  <td className="py-2.5 font-mono text-[11px] text-zinc-400">{pay.transactionRef}</td>
                  <td className="py-2.5">{pay.paymentMethod}</td>
                  <td className="py-2.5 font-semibold text-white">
                    {formatMoney(pay.amountUSD, pay.amountINR)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        pay.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory, Legal and Tax Compliance Disclaimer (Requirement 9 & 15) */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-500 space-y-1 leading-relaxed">
        <p className="font-semibold text-zinc-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-zinc-400" />
          Tax, Identity & Legal Compliance Disclosure
        </p>
        <p>
          Earnings are estimates subject to fraud audits and advertiser payment reconciliation. Under Indian Income Tax Section 194R/194C and International withholding treaties (IRS Form W-8BEN), standard TDS is deducted where applicable. Payouts require verified PAN/GST or Bank KYC.
        </p>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowPayoutModal(false)}
        >
          <div
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Request Payout
            </h3>

            <form onSubmit={handlePayoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Payout Amount (USD)</label>
                <input
                  type="number"
                  min="50"
                  max={currentUser.balanceUSD}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Equivalent to ~₹{(parseFloat(payoutAmount || '0') * 83.2).toLocaleString('en-IN')}. Available: ${currentUser.balanceUSD}
                </span>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Select Transfer Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Bank Transfer', 'PayPal'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                        paymentMethod === m
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  {paymentMethod === 'UPI' ? 'Virtual Payment Address (UPI ID)' : 'Account Details / IFSC / Email'}
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={e => setAccountDetails(e.target.value)}
                  placeholder="e.g. yourname@okhdfcbank"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
