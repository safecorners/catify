'use client';

import React from 'react';
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';
import { FloatingNav } from '@/components/Landing/FloatingNav';
import { HeroSection } from '@/components/Landing/HeroSection';
import { BentoGrid } from '@/components/Landing/BentoGrid';
import { ArrowUpRight } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export default function LandingPage() {
  return (
    <AuthProvider>
      <div className="min-h-[100dvh] bg-[#faf9f6] text-stone-900 selection:bg-amber-200 selection:text-amber-950 relative overflow-x-hidden">
        {/* 플로팅 아일랜드 네비게이션 */}
        <FloatingNav />

        <main>
          {/* 히어로 섹션 */}
          <HeroSection />

          {/* 비대칭 벤토 그리드 */}
          <BentoGrid />

          {/* 하단 최종 진입 배너 섹션 (Macro-Whitespace & Doppelrand) */}
          <section className="py-24 md:py-36 px-4 max-w-4xl mx-auto">
            <div className="p-2.5 rounded-[3rem] bg-stone-900/[0.03] ring-1 ring-stone-900/[0.06]">
              <div className="rounded-[calc(3rem-0.625rem)] bg-stone-900 text-white inner-highlight p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                {/* 앰비언트 백라이트 */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                    Join The Virtual Pet Atelier
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                    지금 바로 다이아냥과의<br />
                    첫 만남을 시작해보세요.
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 font-medium">
                    클라우드 저장으로 언제 어디서나 당신만의 고양이가 함께합니다.
                  </p>
                </div>

                <Link
                  href="/game"
                  onClick={() => soundEngine.playClick()}
                  className="group shrink-0 flex items-center gap-3 pl-6 pr-2 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-sm font-extrabold transition-all duration-500 ease-fluid shadow-lg active:scale-[0.98]"
                >
                  <span>지금 바로 시작하기</span>
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* 푸터 */}
        <footer className="py-12 border-t border-stone-200/60 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto px-6 gap-4">
          <div className="flex items-center gap-2 font-bold text-stone-700">
            <span className="text-amber-500">✦</span> 다이아냥 (Diamond Cat Studio)
          </div>
          <div className="text-[11px] text-stone-400">
            Crafted with Next.js 16, Tailwind CSS & Supabase. Inspired by Hand-drawn Wireframe.
          </div>
          <a
            href="https://github.com/safecorners/catify"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </footer>
      </div>
    </AuthProvider>
  );
}
