'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export function FloatingNav() {
  const { user } = useAuth();

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
      <nav className="rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_12px_35px_-10px_rgba(28,25,23,0.08)] px-5 py-2.5 flex items-center justify-between transition-all">
        {/* 브랜드 로고 */}
        <Link
          href="/"
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs transition-transform duration-500 ease-fluid group-hover:rotate-12 group-hover:scale-105">
            ✦
          </div>
          <span className="font-extrabold text-sm tracking-tight text-stone-900 flex items-center gap-1">
            다이아냥 <span className="text-[10px] text-stone-400 font-mono font-normal">DIAMOND CAT</span>
          </span>
        </Link>

        {/* 중앙 앵커 네비게이션 */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <a
            href="#features"
            onClick={() => soundEngine.playClick()}
            className="hover:text-stone-950 transition-colors"
          >
            기능 아키텍처
          </a>
          <a
            href="#physics"
            onClick={() => soundEngine.playClick()}
            className="hover:text-stone-950 transition-colors"
          >
            물리 시뮬레이션
          </a>
          <a
            href="#custom"
            onClick={() => soundEngine.playClick()}
            className="hover:text-stone-950 transition-colors"
          >
            커스터마이징
          </a>
        </div>

        {/* 우측 CTA: Button-in-Button Pattern */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/game"
              onClick={() => soundEngine.playClick()}
              className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all duration-500 ease-fluid shadow-xs active:scale-[0.98]"
            >
              <span>스튜디오 입장</span>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={14} />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                onClick={() => soundEngine.playClick()}
                className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/login"
                onClick={() => soundEngine.playClick()}
                className="group flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all duration-500 ease-fluid shadow-xs active:scale-[0.98]"
              >
                <span>시작하기</span>
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
