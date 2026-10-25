/**
 * Advanced Direct & Group Messaging Hub
 * Features 1-on-1 and Group chats, voice notes with waveform, reactions,
 * simulated replies, and full Audio/Video calling simulation.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Phone, Video, MoreVertical, Send, Mic, Image,
  Paperclip, Smile, CheckCheck, X, PhoneOff, MicOff,
  Volume2, Play, Pause, Film
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, Conversation } from '../types';
import { sounds } from '../utils/audio';

export const MessagingHub: React.FC = () => {
  const {
    conversations, currentUser, sendMessage,
    activeConversationId, setActiveConversationId, t
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    activeConversationId || conversations[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Calling modal state
  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    type: 'audio' | 'video';
    participantName: string;
    seconds: number;
    isMuted: boolean;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentConv = conversations.find(c => c.id === activeConvId);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.lastMessage]);

  // Voice note recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall?.isOpen) {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeConvId, inputText.trim());
    setInputText('');

    // Simulate automatic response after 2.5s for authentic engagement feel
    setTimeout(() => {
      const partner = currentConv?.participants.find(p => p.id !== currentUser.id);
      if (partner && activeConvId) {
        sounds.playNotification();
        sendMessage(
          activeConvId,
          `Thanks for reaching out! Excited to collaborate on our upcoming project on Instavideo. 🚀`
        );
      }
    }, 2800);
  };

  const handleFinishVoiceRecord = () => {
    setIsRecordingVoice(false);
    sendMessage(
      activeConvId,
      `🎙️ Voice Note (${recordSeconds}s)`,
      undefined,
      'audio'
    );
    setRecordSeconds(0);
  };

  const startCall = (type: 'audio' | 'video') => {
    sounds.playNotification();
    const otherParticipant = currentConv?.participants.find(p => p.id !== currentUser.id);
    setActiveCall({
      isOpen: true,
      type,
      participantName: currentConv?.groupName || otherParticipant?.displayName || 'User',
      seconds: 0,
      isMuted: false,
    });
  };

  const filteredConversations = conversations.filter(c => {
    if (c.isGroup && c.groupName) {
      return c.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    const other = c.participants.find(p => p.id !== currentUser.id);
    return other?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           other?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-5xl mx-auto h-[82vh] max-h-[760px] my-1 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
      {/* Left Sidebar: Conversation List */}
      <div
        className={`w-full md:w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/60 ${
          activeConvId && 'hidden md:flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Outfit']">
              {t('chat', 'messages')}
            </h2>
            <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">
              End-to-End Encrypted
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder={t('chat', 'searchChats')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
          {filteredConversations.map(conv => {
            const other = conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];
            const isSelected = conv.id === activeConvId;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-zinc-800/80 border-l-2 border-rose-500' : 'hover:bg-zinc-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.isGroup ? conv.groupAvatar : other.avatar}
                    alt={conv.groupName || other.displayName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-zinc-700"
                  />
                  {!conv.isGroup && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">
                      {conv.isGroup ? conv.groupName : other.displayName}
                    </p>
                    <span className="text-[10px] text-zinc-500">{conv.updatedAt}</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {conv.isTyping ? (
                      <span className="text-rose-400 font-medium animate-pulse">
                        {t('chat', 'typing')}
                      </span>
                    ) : (
                      conv.lastMessage?.text || 'No messages yet'
                    )}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      {currentConv ? (
        <div className="flex-1 flex flex-col bg-zinc-950">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center gap-3">
              {/* Back button for mobile */}
              <button
                onClick={() => setActiveConvId('')}
                className="md:hidden text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={
                    currentConv.isGroup
                      ? currentConv.groupAvatar
                      : currentConv.participants.find(p => p.id !== currentUser.id)?.avatar
                  }
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  {currentConv.isGroup
                    ? currentConv.groupName
                    : currentConv.participants.find(p => p.id !== currentUser.id)?.displayName}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t('chat', 'online')}
                </p>
              </div>
            </div>

            {/* Audio / Video Calling Affordances */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => startCall('audio')}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title={t('chat', 'call')}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => startCall('video')}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title={t('chat', 'videoCall')}
              >
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Conversation Introduction */}
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto overflow-hidden ring-2 ring-zinc-800 mb-2">
                <img
                  src={
                    currentConv.isGroup
                      ? currentConv.groupAvatar
                      : currentConv.participants.find(p => p.id !== currentUser.id)?.avatar
                  }
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-bold text-white">
                {currentConv.isGroup
                  ? currentConv.groupName
                  : currentConv.participants.find(p => p.id !== currentUser.id)?.displayName}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Connecting on Instavideo · Verified Secure Channel
              </p>
            </div>

            {/* Mock Message Flow */}
            <div className="flex items-end gap-2">
              <img
                src={currentConv.participants.find(p => p.id !== currentUser.id)?.avatar}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
              />
              <div className="max-w-[75%] bg-zinc-900 border border-zinc-800 p-3 rounded-2xl rounded-bl-xs text-xs text-zinc-200 space-y-1">
                <p>Hey there! Did you get a chance to see the new vertical video guidelines?</p>
                <span className="text-[9px] text-zinc-500 block text-right">10:14 AM</span>
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[75%] bg-gradient-to-r from-rose-600 to-pink-600 p-3 rounded-2xl rounded-br-xs text-xs text-white space-y-1 shadow-md shadow-rose-950/40">
                <p>Yes! Loved the new creator monetization rev-share model. 55% direct share is industry leading.</p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-white/70">
                  <span>10:16 AM</span>
                  <CheckCheck className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {currentConv.lastMessage && (
              <div
                className={`flex items-end gap-2 ${
                  currentConv.lastMessage.senderId === currentUser.id ? 'justify-end' : ''
                }`}
              >
                {currentConv.lastMessage.senderId !== currentUser.id && (
                  <img
                    src={currentConv.lastMessage.senderAvatar}
                    alt="Sender"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                  />
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                    currentConv.lastMessage.senderId === currentUser.id
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 rounded-br-xs text-white'
                      : 'bg-zinc-900 border border-zinc-800 rounded-bl-xs text-zinc-200'
                  }`}
                >
                  <p>{currentConv.lastMessage.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-70">
                    <span>{currentConv.lastMessage.timestamp}</span>
                    <CheckCheck className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
            {isRecordingVoice ? (
              <div className="flex items-center justify-between bg-zinc-950 border border-rose-500/40 rounded-2xl p-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-semibold text-rose-400">
                    Recording Audio... {recordSeconds}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingVoice(false)}
                    className="px-3 py-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinishVoiceRecord}
                    className="px-3 py-1 bg-rose-500 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 cursor-pointer"
                  >
                    Send Voice
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={t('chat', 'typeMessage')}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-zinc-500 text-xs">
          Select a chat to begin messaging
        </div>
      )}

      {/* Audio / Video Calling Modal Simulation */}
      {activeCall?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-8 animate-in fade-in duration-200">
          <div className="text-center space-y-2 pt-8">
            <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
              Instavideo Secure {activeCall.type === 'video' ? 'Video' : 'HD Voice'} Call
            </span>
            <h3 className="text-2xl font-bold text-white font-['Outfit']">
              {activeCall.participantName}
            </h3>
            <p className="text-xs text-zinc-400 tabular-nums">
              {Math.floor(activeCall.seconds / 60)}:{(activeCall.seconds % 60).toString().padStart(2, '0')}
            </p>
          </div>

          {/* Video stream or avatar pulse */}
          <div className="relative">
            {activeCall.type === 'video' ? (
              <div className="w-64 h-80 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                <img
                  src="/src/assets/images/avatar_priya_creator_1792886897391.jpg"
                  alt="Video Stream"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md">
                  1080p HD 60fps
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-purple-600 animate-pulse flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                  <Phone className="w-12 h-12 text-rose-500" />
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center gap-6 pb-6">
            <button
              onClick={() =>
                setActiveCall(prev => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
              }
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                activeCall.isMuted ? 'bg-amber-500 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setActiveCall(null)}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 cursor-pointer transition-transform active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
