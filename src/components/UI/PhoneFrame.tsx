'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { Volume2, VolumeX, Cloud, CloudOff, RefreshCw, User as UserIcon, Edit2, Sparkles } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { AuthModal } from '@/components/Auth/AuthModal';

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { cat, syncStatus, renameCat } = useGame();
  const { user, isConfigured } = useAuth();

  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(cat.name);

  const handleToggleMute = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundEngine.playClick();
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      renameCat(tempName.trim());
      soundEngine.playClick();
    }
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100">
      {/* 스마트폰 외형 프레임 */}
      <div className="relative w-full max-w-[420px] h-[820px] max-h-[96vh] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/60 flex flex-col">
        {/* 상단 스피커 & 카메라 노치 */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-8 h-1.5 rounded-full bg-slate-800" />
        </div>

        {/* 폰 내부 화면 */}
        <div className="relative w-full h-full bg-gradient-to-b from-amber-50/50 via-white to-orange-50/40 rounded-[34px] overflow-hidden flex flex-col border border-white/80">
          {/* 상단 스테이터스 바 & 헤더 */}
          <header className="pt-7 px-4 pb-2 flex items-center justify-between border-b border-amber-100/70 bg-white/70 backdrop-blur-md z-20">
            {/* 고양이 레벨 & 이름 */}
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Sparkles size={10} />
                Lv.{cat.level}
              </span>

              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={10}
                    autoFocus
                    className="w-20 px-1.5 py-0.5 text-xs font-bold border border-amber-300 rounded bg-white"
                  />
                  <button type="submit" className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">
                    저장
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempName(cat.name);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-1 font-extrabold text-slate-800 text-sm hover:text-amber-600 transition-colors"
                  title="이름 바꾸기"
                >
                  <span>{cat.name}</span>
                  <Edit2 size={12} className="text-slate-400" />
                </button>
              )}
            </div>

            {/* 유틸리티 버튼들: 사운드 토글, 클라우드 동기화 상태, 인증 모달 */}
            <div className="flex items-center gap-1.5">
              {/* 사운드 토글 */}
              <button
                onClick={handleToggleMute}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                title={isMuted ? '음소거 해제' : '음소거'}
              >
                {isMuted ? <VolumeX size={14} className="text-rose-500" /> : <Volume2 size={14} />}
              </button>

              {/* 클라우드 동기화 상태 아이콘 */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors relative"
                title={
                  syncStatus === 'saved'
                    ? 'Supabase 클라우드 동기화됨'
                    : syncStatus === 'saving'
                    ? '동기화 중...'
                    : syncStatus === 'error'
                    ? '동기화 오류'
                    : '로컬 모드 (로그인하여 클라우드 연동)'
                }
              >
                {syncStatus === 'saving' ? (
                  <RefreshCw size={13} className="text-amber-500 animate-spin" />
                ) : syncStatus === 'saved' ? (
                  <Cloud size={13} className="text-emerald-500" />
                ) : isConfigured && user ? (
                  <Cloud size={13} className="text-blue-500" />
                ) : (
                  <CloudOff size={13} className="text-slate-400" />
                )}
              </button>

              {/* 사용자 계정 버튼 */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className={`h-7 px-2 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                  user
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-slate-800 text-white hover:bg-slate-700 shadow-xs'
                }`}
              >
                <UserIcon size={12} />
                <span className="max-w-[60px] truncate text-[11px]">
                  {user ? user.email?.split('@')[0] : '로그인'}
                </span>
              </button>
            </div>
          </header>

          {/* 메인 화면 콘텐츠 슬롯 */}
          <main className="flex-1 relative overflow-hidden flex flex-col">{children}</main>

          {/* 하단 홈 바 */}
          <div className="py-2 flex justify-center bg-transparent pointer-events-none">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* 인증 모달 */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
