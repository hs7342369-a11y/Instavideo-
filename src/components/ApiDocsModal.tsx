/**
 * Interactive API Documentation & Database Architecture Viewer
 * Satisfies Technical Requirements, Database Models, and Deployment Guide.
 */
import React, { useState } from 'react';
import {
  X, Database, Server, Shield, Terminal, BookOpen,
  Code, Check, Layers, Cpu, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApiDocsModal: React.FC = () => {
  const { isApiDocsModalOpen, setIsApiDocsModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'schema' | 'endpoints' | 'deployment' | 'security'>('schema');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  if (!isApiDocsModalOpen) return null;

  const copyText = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    setCopiedEndpoint(txt);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    { method: 'POST', path: '/api/v1/auth/otp-request', desc: 'Generate and dispatch SMS/Email OTP with rate-limiting' },
    { method: 'POST', path: '/api/v1/auth/verify-otp', desc: 'Validate OTP token and return authenticated JWT session' },
    { method: 'GET', path: '/api/v1/feed/home', desc: 'Fetch personalized feed with cursor-based pagination' },
    { method: 'POST', path: '/api/v1/posts', desc: 'Create photo/carousel post with caption & hashtag indexing' },
    { method: 'POST', path: '/api/v1/reels/upload', desc: 'Upload vertical short video with HLS transcoding' },
    { method: 'POST', path: '/api/v1/interactions/like', desc: 'Idempotent toggle like on post, reel, or comment' },
    { method: 'POST', path: '/api/v1/monetization/payout', desc: 'Initiate UPI/NEFT creator revenue withdrawal' },
    { method: 'GET', path: '/api/v1/admin/moderation-queue', desc: 'Retrieve flagged reports for admin moderation' },
    { method: 'POST', path: '/api/v1/admin/verify-badge', desc: 'Approve or reject creator blue check verification' },
  ];

  const dbTables = [
    { name: 'users', fields: 'id, username, phone, email, password_hash, role, is_verified, is_private, created_at' },
    { name: 'profiles', fields: 'user_id, display_name, bio, location, website, avatar_url, cover_url' },
    { name: 'follows', fields: 'follower_id, following_id, status (active/pending), created_at' },
    { name: 'posts', fields: 'id, user_id, caption, location, media_type, category, view_count, created_at' },
    { name: 'media_files', fields: 'id, post_id, reel_id, url, resolution, duration_ms, cdn_path' },
    { name: 'reels', fields: 'id, user_id, video_url, thumbnail_url, audio_title, audio_artist, watch_time_sec' },
    { name: 'comments', fields: 'id, post_id, reel_id, user_id, parent_comment_id, text, created_at' },
    { name: 'likes', fields: 'user_id, target_type (post/reel/comment), target_id, created_at' },
    { name: 'saves', fields: 'user_id, post_id, reel_id, collection_name, created_at' },
    { name: 'stories', fields: 'id, user_id, media_url, expires_at (24h TTL index), viewer_count' },
    { name: 'chats', fields: 'id, is_group, group_name, group_avatar, created_at, updated_at' },
    { name: 'messages', fields: 'id, chat_id, sender_id, text, media_url, media_type, is_read, created_at' },
    { name: 'notifications', fields: 'id, user_id, actor_id, type, message, ref_id, is_read, created_at' },
    { name: 'channels', fields: 'id, user_id, custom_handle, subscriber_count, banner_url, membership_tier' },
    { name: 'monetization_earnings', fields: 'creator_id, period_month, ad_rev_usd, sub_rev_usd, gifts_usd, finalized_at' },
    { name: 'payout_requests', fields: 'id, creator_id, amount_usd, amount_inr, method, upi_id, ifsc, status, ref' },
    { name: 'admin_audit_logs', fields: 'id, admin_id, action, target_type, target_id, ip_address, timestamp' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={() => setIsApiDocsModalOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Instavideo System Architecture & API
              </h2>
              <p className="text-xs text-zinc-400">
                Scalable Backend Specifications, Database Models & API Endpoints
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApiDocsModalOpen(false)}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          {[
            { id: 'schema', label: 'Database Schema (24 Models)', icon: Database },
            { id: 'endpoints', label: 'REST API Endpoints', icon: Server },
            { id: 'deployment', label: 'Deployment & Scaling', icon: Globe },
            { id: 'security', label: 'Security & Compliance', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Database Schema */}
        {activeTab === 'schema' && (
          <div className="space-y-3 text-xs">
            <p className="text-zinc-300">
              PostgreSQL relational schema with composite indexes, foreign key cascading, and partition tables for high-throughput video events.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {dbTables.map(t => (
                <div key={t.name} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-400">table: {t.name}</span>
                    <span className="text-[10px] text-zinc-600 uppercase font-semibold">Indexed</span>
                  </div>
                  <p className="font-mono text-[11px] text-zinc-400 leading-tight">
                    {t.fields}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: REST API Endpoints */}
        {activeTab === 'endpoints' && (
          <div className="space-y-3 text-xs">
            <div className="divide-y divide-zinc-800/80 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              {endpoints.map(ep => (
                <div key={ep.path} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        ep.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-semibold text-white block">
                        {ep.path}
                      </span>
                      <span className="text-[11px] text-zinc-400">{ep.desc}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyText(`${ep.method} ${ep.path}`)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 cursor-pointer"
                    title="Copy Endpoint"
                  >
                    {copiedEndpoint === `${ep.method} ${ep.path}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Code className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Deployment & Scaling */}
        {activeTab === 'deployment' && (
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Production Deployment Architecture
              </h4>
              <p>
                - <strong>Web & Mobile PWA</strong>: Vite + React 19 optimized bundle with progressive service-worker caching for poor 3G/4G connectivity across Tier 2 & 3 Indian cities.
              </p>
              <p>
                - <strong>Media Processing Pipeline</strong>: Cloud Storage buckets with HLS / DASH adaptive bitrate transcoding (1080p, 720p, 480p, 360p) for vertical reel playback.
              </p>
              <p>
                - <strong>Realtime Engine</strong>: WebSocket / WebRTC mesh for direct messaging, live chat streams, and instant notifications.
              </p>
              <p>
                - <strong>Build & Serve</strong>: <code>npm run build</code> outputs to <code>/dist</code>, served via Express node cluster on port 3000.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Compliance */}
        {activeTab === 'security' && (
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 text-xs text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              Security Hardening & Regulatory Guardrails
            </h4>
            <p>
              - <strong>Authentication</strong>: JWT with short-lived access tokens (15m) and secure HttpOnly refresh cookies.
            </p>
            <p>
              - <strong>Anti-Bot & Rate Limits</strong>: Token bucket algorithm (max 60 API calls/min per IP) to prevent duplicate likes, follow spam, and automated scraping.
            </p>
            <p>
              - <strong>Tax & Indian Financial Standards</strong>: Payout gateway enforces Indian Income Tax Section 194R compliance and UPI NPCI verification before disbursement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
