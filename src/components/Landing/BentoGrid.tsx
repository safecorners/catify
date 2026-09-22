'use client';

import React, { useState } from 'react';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { CatColor } from '@/types/game';
import { Sparkles, Activity, Palette, Database, Volume2, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export function BentoGrid() {
  const [demoColor, setDemoColor] = useState<CatColor>('orange');
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  const triggerAudio = (type: 'meow' | 'purr' | 'munch' | 'bell', label: string) => {
    setAudioFeedback(label);
    if (type === 'meow') soundEngine.playMeow(1.2);
    if (type === 'purr') soundEngine.playPurr();
    if (type === 'munch') soundEngine.playMunch();
    if (type === 'bell') soundEngine.playBell();

    setTimeout(() => setAudioFeedback(null), 1200);
  };

  return (
    <section id="features" className="py-24 md:py-36 px-4 max-w-5xl mx-auto">
      {/* 섹션 헤더 */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-900/[0.04] text-stone-700 ring-1 ring-stone-900/[0.08] mb-4">
          <Activity size={11} className="text-amber-600" />
          <span>Core Engineering Pillars</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          단순한 그래픽을 넘어선<br />
          정밀한 인터랙션 아키텍처.
        </h2>
      </div>

      {/* 비대칭 벤토 그리드 (Asymmetrical Bento) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Card 1: 낚싯대 줄 물리 엔진 (Col-span-8) */}
        <div id="physics" className="md:col-span-8 p-2 rounded-[2.5rem] bg-stone-900/[0.02] ring-1 ring-stone-900/[0.06]">
          <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-white inner-highlight soft-ambient-shadow p-7 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 w-fit px-2.5 py-1 rounded-full mb-3">
                <Sparkles size={12} />
                <span>Verlet & Spring Physics</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                &ldquo;흔들 수 있어야함&rdquo;을 구현한 물리 밧줄 시뮬레이션
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-lg">
                마우스 및 터치 제스처 속도와 중력, 감쇠 계수를 실시간 연산하여, 낚싯대를 휘두르는 강도에 따라 장난감이 출렁이고 고양이가 도약하여 덮치는 역동적인 물리 경험을 제공합니다.
              </p>
            </div>

            {/* 시각적 물리 데모 그래픽 */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>깃털 낚싯대 · 레이저 · 방울 쥐 · 털실 4종 탑재</span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">FPS: 60Hz Target</span>
            </div>
          </div>
        </div>

        {/* Card 2: 실시간 파라메트릭 커스텀 (Col-span-4) */}
        <div id="custom" className="md:col-span-4 p-2 rounded-[2.5rem] bg-stone-900/[0.02] ring-1 ring-stone-900/[0.06]">
          <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-white inner-highlight soft-ambient-shadow p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 w-fit px-2.5 py-1 rounded-full mb-3">
                <Palette size={12} />
                <span>Real-Time Styling</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1">
                실시간 외형 매트릭스
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                털 색상, 줄무늬, 귀 리본, 방울 목걸이를 원클릭으로 변경하세요.
              </p>

              {/* 미니 팔레트 인터랙션 */}
              <div className="flex items-center gap-2 mb-4">
                {(['orange', 'black', 'coral', 'white'] as CatColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      soundEngine.playClick();
                      setDemoColor(c);
                    }}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      demoColor === c ? 'scale-125 ring-2 ring-purple-600' : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor:
                        c === 'orange' ? '#fbbf24' : c === 'black' ? '#262626' : c === 'coral' ? '#f87171' : '#ffffff',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center -mb-2">
              <GeometricCat
                color={demoColor}
                pattern="stripes"
                accessories={{ ears: 'ribbon', neck: 'bell', hat: 'none', glasses: 'none' }}
                size={140}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Supabase 클라우드 동기화 (Col-span-5) */}
        <div className="md:col-span-5 p-2 rounded-[2.5rem] bg-stone-900/[0.02] ring-1 ring-stone-900/[0.06]">
          <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-white inner-highlight soft-ambient-shadow p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded-full mb-3">
                <Database size={12} />
                <span>Supabase PostgreSQL + RLS</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2">
                무결점 클라우드 동기화
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                포만감, 행복도, 친밀도, 외형 정보가 Supabase PostgreSQL 데이터베이스에 영구 보존됩니다. Row Level Security(RLS)로 본인의 고양이 데이터만 안전하게 격리됩니다.
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Database Connected</span>
              </span>
              <span className="text-stone-400">Debounce: 600ms</span>
            </div>
          </div>
        </div>

        {/* Card 4: Web Audio 사운드 신시사이저 (Col-span-7) */}
        <div className="md:col-span-7 p-2 rounded-[2.5rem] bg-stone-900/[0.02] ring-1 ring-stone-900/[0.06]">
          <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-white inner-highlight soft-ambient-shadow p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  <Volume2 size={12} />
                  <span>Procedural Web Audio Engine</span>
                </div>
                {audioFeedback && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                    ♫ {audioFeedback}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2">
                순수 코드로 합성되는 감각적인 사운드스케이프
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-5">
                외부 대용량 MP3 파일 다운로드 딜레이 없이, Web Audio API의 오실레이터와 바이쿼드 필터로 실시간 합성되는 골골송과 야옹 소리를 직접 테스트해보세요.
              </p>

              {/* 실시간 사운드 테스트 버튼들 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => triggerAudio('meow', '야옹~')}
                  className="py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200/60 active:scale-95 transition-all text-center"
                >
                  🐱 야옹 소리
                </button>
                <button
                  onClick={() => triggerAudio('purr', '골골골...')}
                  className="py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200/60 active:scale-95 transition-all text-center"
                >
                  💤 골골송
                </button>
                <button
                  onClick={() => triggerAudio('munch', '아삭아삭!')}
                  className="py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200/60 active:scale-95 transition-all text-center"
                >
                  🍽️ 먹는 소리
                </button>
                <button
                  onClick={() => triggerAudio('bell', '딸랑딸랑♪')}
                  className="py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200/60 active:scale-95 transition-all text-center"
                >
                  🔔 방울 소리
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
