/**
 * Authentication, Sign Up & OTP Verification Modal
 * Supports Phone (+91), Email, Username, OTP verification with auto-fill test button,
 * and Instant Role/Account switching.
 */
import React, { useState } from 'react';
import {
  X, Phone, Mail, User, Lock, KeyRound, CheckCircle2,
  Sparkles, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, users, switchUser, t } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpSent, setOtpSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setAuthMode('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === generatedOtp || otpCode.length === 4) {
      // Pick first user or switch
      switchUser('user_rohan');
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-rose-500/40">
              <img
                src="/src/assets/images/instavideo_icon_1792886894981.jpg"
                alt="Brand"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold font-['Outfit'] bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Instavideo
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Toggle */}
        {authMode !== 'otp' && (
          <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setAuthMode('login')}
              className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                authMode === 'signup' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Login Form */}
        {authMode === 'login' && (
          <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Mobile (+91), Email or Username</label>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="+91 98765 43210 or rohan@example.com"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Password</label>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white">
                <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md cursor-pointer transition-transform active:scale-95"
            >
              Continue with OTP Verification →
            </button>
          </form>
        )}

        {/* Signup Form */}
        {authMode === 'signup' && (
          <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Rohan Sharma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Unique Username</label>
              <input
                type="text"
                placeholder="rohan_creator"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Mobile or Email</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Send SMS Verification Code
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {authMode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-white">Enter 4-Digit Code</span>
              <p className="text-[11px] text-zinc-400">
                Code sent to <span className="text-white font-medium">{identifier || 'mobile'}</span>
              </p>
            </div>

            {/* Test helper banner */}
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-[11px] text-rose-300">
                Test OTP Code: <strong className="text-white font-mono">{generatedOtp}</strong>
              </span>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp)}
                className="block mx-auto text-[10px] text-rose-400 underline mt-1 cursor-pointer"
              >
                Auto-fill Code
              </button>
            </div>

            <input
              type="text"
              maxLength={4}
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              placeholder="0 0 0 0"
              className="w-full text-center text-xl tracking-widest font-mono bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Verify & Enter Instavideo
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-zinc-500 hover:text-zinc-300 text-[11px] cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Switch Account Demo Shortcut */}
        <div className="border-t border-zinc-800 pt-3">
          <p className="text-[10px] uppercase font-bold text-zinc-500 text-center tracking-wider mb-2">
            Instant Login as Pre-Configured Accounts
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {users.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id);
                  setIsAuthModalOpen(false);
                }}
                className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex items-center gap-2 text-left cursor-pointer"
              >
                <img
                  src={u.avatar}
                  alt={u.username}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="text-[10px] text-zinc-300 font-medium truncate">
                  @{u.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
