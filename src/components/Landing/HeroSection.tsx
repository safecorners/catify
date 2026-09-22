'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { ArrowUpRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export function HeroSection() {
  const [isPurring, setIsPurring] = useState(false);
  const [lookTarget, setLookTarget] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 340;
    setLookTarget({ x, y });
  }, []);

  const handlePet = () => {
    setIsPurring(true);
    soundEngine.playPurr();
    soundEngine.playMeow(1.15);
    setTimeout(() => setIsPurring(false), 1500);
  };

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* 배경 앰비언트 글로우 오브 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/25 via-orange-100/30 to-rose-200/20 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* 마이크로 아이브로우 태그 */}
      <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-900/[0.04] text-stone-700 ring-1 ring-stone-900/[0.08] mb-6 backdrop-blur-xs">
        <Sparkles size={11} className="text-amber-600" />
        <span>Architectural Virtual Pet Experience</span>
      </div>

      {/* 대형 타이포그래피 헤딩 */}
      <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
        기하학적 조형미를 품은<br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-stone-900 via-amber-800 to-stone-800 bg-clip-text text-transparent">
          {' '}나만의 디지털 캣, 다이아냥.
        </span>
      </h1>

      {/* 서브 문구 */}
      <p className="max-w-2xl text-sm sm:text-base text-stone-500 font-medium leading-relaxed mb-10">
        스케치 와이어프레임의 조형성을 그대로 계승한 벡터 렌더링,
        탄성 밧줄 물리 엔진, 순수 Web Audio 신시사이저가 유기적으로 엮인 Awwwards-tier 가상 반려동물 스튜디오.
      </p>

      {/* 듀얼 CTA 버튼 (Button-in-Button) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
        <Link
          href="/game"
          onClick={() => soundEngine.playClick()}
          className="group flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-extrabold transition-all duration-500 ease-fluid shadow-[0_12px_25px_-8px_rgba(28,25,23,0.25)] active:scale-[0.98]"
        >
          <span>다이아냥 스튜디오 시작하기</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={16} />
          </div>
        </Link>

        <Link
          href="/login"
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold ring-1 ring-stone-900/[0.08] shadow-xs transition-all duration-300"
        >
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Supabase 클라우드 계정 연동</span>
        </Link>
      </div>

      {/* 인터랙티브 라이브 쇼케이스 (Double-Bezel Doppelrand Architecture) */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        className="w-full max-w-md mx-auto"
      >
        {/* Outer Shell */}
        <div className="p-2.5 rounded-[2.8rem] bg-stone-900/[0.03] ring-1 ring-stone-900/[0.07] shadow-[0_30px_60px_-15px_rgba(28,25,23,0.06)]">
          {/* Inner Core */}
          <div className="rounded-[calc(2.8rem-0.625rem)] bg-gradient-to-b from-stone-50/80 via-white to-amber-50/30 inner-highlight p-8 flex flex-col items-center justify-center relative overflow-hidden border border-white/60">
            {/* 앰비언트 백라이트 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

            {/* 좌측 플로팅 뱃지 */}
            <div className="absolute top-6 left-6 flex flex-col gap-1.5 pointer-events-none">
              <span className="text-[10px] font-bold text-stone-500 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/60 shadow-xs">
                🍗 포만감 85%
              </span>
              <span className="text-[10px] font-bold text-stone-500 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/60 shadow-xs">
                💖 행복도 94%
              </span>
            </div>

            {/* 우측 플로팅 레벨 */}
            <div className="absolute top-6 right-6 pointer-events-none">
              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-300/80 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-400 shadow-xs">
                Lv.1 다이아냥
              </span>
            </div>

            {/* 고양이 캐릭터 프리뷰 (마우스 시선 추적) */}
            <div className="relative z-10 my-4 animate-bob">
              <GeometricCat
                color="orange"
                pattern="stripes"
                accessories={{ ears: 'none', neck: 'bell', hat: 'none', glasses: 'none' }}
                isPurring={isPurring}
                lookTarget={lookTarget}
                size={230}
                onClick={handlePet}
              />
            </div>

            {/* 인터랙션 가이드 버튼 */}
            <button
              onClick={handlePet}
              className="mt-2 group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-900/5 hover:bg-stone-900/10 text-stone-600 text-xs font-bold transition-all duration-300 active:scale-95"
            >
              <Heart size={13} className="text-rose-500 fill-rose-500 transition-transform duration-300 group-hover:scale-125" />
              <span>터치하여 쓰다듬어보기</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
