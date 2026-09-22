'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import {
  Volume2,
  VolumeX,
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export function StudioHeader() {
  const router = useRouter();
  const { cat, syncStatus, renameCat } = useGame();
  const { user, signOut } = useAuth();

  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());
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

  const handleSignOut = async () => {
    soundEngine.playClick();
    await signOut();
    router.push('/login');
  };

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-6xl">
      <div className="rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_10px_30px_-10px_rgba(28,25,23,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* 좌측: 메인으로 이동 & 고양이 이름 & 레벨 */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => soundEngine.playClick()}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors pr-2 border-r border-stone-200"
            title="메인 랜딩 페이지로 이동"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">메인</span>
          </Link>

          {/* 레벨 뱃지 */}
          <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles size={11} />
            Lv.{cat.level}
          </span>

          {/* 고양이 이름 편집 */}
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={10}
                autoFocus
                className="w-24 px-2 py-0.5 text-xs font-bold border border-amber-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="p-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Check size={12} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempName(cat.name);
                setIsEditingName(true);
              }}
              className="group flex items-center gap-1.5 font-extrabold text-stone-900 text-sm hover:text-amber-700 transition-colors"
              title="이름 바꾸기"
            >
              <span>{cat.name}</span>
              <Edit2 size={12} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
            </button>
          )}
        </div>

        {/* 우측: 유틸리티 (사운드 토글, 클라우드 상태, 유저 프로필 & 로그아웃) */}
        <div className="flex items-center gap-2">
          {/* 사운드 토글 */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX size={15} className="text-rose-500" /> : <Volume2 size={15} />}
          </button>

          {/* 클라우드 동기화 상태 */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-[11px] font-semibold text-stone-600"
            title={
              syncStatus === 'saved'
                ? 'Supabase 클라우드 동기화 완료'
                : syncStatus === 'saving'
                ? '클라우드 저장 중...'
                : '동기화 상태'
            }
          >
            {syncStatus === 'saving' ? (
              <RefreshCw size={12} className="text-amber-500 animate-spin" />
            ) : syncStatus === 'saved' ? (
              <Cloud size={12} className="text-emerald-500" />
            ) : (
              <CloudOff size={12} className="text-stone-400" />
            )}
            <span className="hidden md:inline text-[10px]">
              {syncStatus === 'saving' ? '저장 중' : syncStatus === 'saved' ? '동기화됨' : '로컬'}
            </span>
          </div>

          {/* 유저 계정 & 로그아웃 */}
          {user && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
              <span className="hidden sm:inline text-xs font-medium text-stone-600 max-w-[120px] truncate">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                title="로그아웃"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
