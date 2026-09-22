'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { PlayTool, PlayToolType } from '@/types/game';
import { ToyRopePhysics } from '@/lib/physics';
import { StudioMode } from './StudioDock';

interface StudioStageProps {
  currentMode: StudioMode;
  selectedToolId: PlayToolType;
}

export function StudioStage({ currentMode, selectedToolId }: StudioStageProps) {
  const { cat, petCat, isPurring, isEating, activeFood, isExcited, playWithTool } = useGame();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const physicsRef = useRef<ToyRopePhysics>(new ToyRopePhysics(300, 180));

  const [ropeState, setRopeState] = useState({
    handle: { x: 300, y: 150 },
    mid: { x: 300, y: 220 },
    pendant: { x: 300, y: 290 },
    isShaking: false,
  });

  const lastShakeTimeRef = useRef<number>(0);
  const [showPounceText, setShowPounceText] = useState(false);

  // 물리 애니메이션 루프 (Play 모드일 때만 가동)
  useEffect(() => {
    if (currentMode !== 'play') return;

    let animationFrameId: number;
    const physics = physicsRef.current;

    const loop = () => {
      physics.step();
      const shaking = physics.isShaking();

      setRopeState({
        handle: { ...physics.handle },
        mid: { ...physics.midPoint },
        pendant: { ...physics.pendant },
        isShaking: shaking,
      });

      const now = Date.now();
      if (shaking && now - lastShakeTimeRef.current > 400) {
        lastShakeTimeRef.current = now;
        playWithTool(
          {
            id: selectedToolId,
            name: '',
            description: '',
            icon: '',
            color: '#ef4444',
          },
          1.2
        );

        setShowPounceText(true);
        setTimeout(() => setShowPounceText(false), 900);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentMode, selectedToolId, playWithTool]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentMode === 'play') {
        physicsRef.current.updateHandle(x, y);
      }
    },
    [currentMode]
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`relative w-full h-[100dvh] flex flex-col items-center justify-center select-none overflow-hidden ${
        currentMode === 'play' ? 'cursor-grab active:cursor-grabbing touch-none' : ''
      }`}
    >
      {/* 배경 앰비언트 글로우 오브 */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/40 via-orange-50/50 to-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 덮치기 성공 팡파르 */}
      {showPounceText && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 bg-rose-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg animate-bounce">
          덮치기 성공! 🐾
        </div>
      )}

      {/* 중앙 무대: 고양이 캐릭터 */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* 바닥 그림자 타원 */}
        <div className="absolute -bottom-4 w-60 h-10 bg-stone-300/40 rounded-full blur-md -z-0" />

        {/* 고양이 본체 */}
        <div
          className={`relative z-10 transition-transform duration-300 ${
            currentMode !== 'play' ? 'animate-bob cursor-pointer' : ''
          }`}
          onClick={currentMode !== 'play' ? petCat : undefined}
        >
          <GeometricCat
            color={cat.color}
            pattern={cat.pattern}
            accessories={cat.accessories}
            isEating={isEating}
            isPurring={isPurring}
            isExcited={isExcited}
            lookTarget={currentMode === 'play' ? ropeState.pendant : null}
            size={280}
          />
        </div>

        {/* 먹이 그릇 (Feed 모드일 때 등장) */}
        {currentMode === 'feed' && (
          <div className="relative mt-2 z-20 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {isEating && activeFood && (
              <div className="absolute -top-12 bg-white/95 px-3 py-1 rounded-full shadow-md border border-amber-200 text-xs font-bold text-amber-700 animate-bounce flex items-center gap-1 whitespace-nowrap">
                <span>{activeFood.icon}</span>
                <span>{activeFood.id === 'catnip' ? '뒹굴뒹굴~ 냐아앙!' : '냠냠! 쩝쩝!'}</span>
              </div>
            )}

            <svg width="100" height="48" viewBox="0 0 84 40" className="drop-shadow-md">
              <ellipse cx="42" cy="22" rx="36" ry="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
              <ellipse cx="42" cy="20" rx="34" ry="12" fill="#f1f5f9" />
              {isEating && activeFood && (
                <ellipse
                  cx="42"
                  cy="20"
                  rx="26"
                  ry="9"
                  fill={
                    activeFood.id === 'catnip'
                      ? '#22c55e'
                      : activeFood.id === 'water'
                      ? '#38bdf8'
                      : activeFood.id === 'churu'
                      ? '#fb7185'
                      : '#b45309'
                  }
                  className="animate-pulse"
                />
              )}
            </svg>
            <span className="text-[11px] font-bold text-stone-400 mt-1">
              {isEating ? '먹는 중...' : '밥그릇 (우측 독에서 음식 선택)'}
            </span>
          </div>
        )}
      </div>

      {/* 놀이 모드일 때 전체 화면 물리 낚싯대 SVG 오버레이 */}
      {currentMode === 'play' && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {selectedToolId === 'laser' ? (
            <g>
              <line
                x1={ropeState.handle.x}
                y1={ropeState.handle.y}
                x2={ropeState.pendant.x}
                y2={ropeState.pendant.y + 40}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="8" fill="#ef4444" className="animate-ping" />
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="6" fill="#dc2626" />
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="2.5" fill="#ffffff" />
            </g>
          ) : (
            <g>
              {/* 낚싯대 손잡이 */}
              <line
                x1={ropeState.handle.x - 55}
                y1={ropeState.handle.y - 35}
                x2={ropeState.handle.x}
                y2={ropeState.handle.y}
                stroke="#dc2626"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1={ropeState.handle.x - 55}
                y1={ropeState.handle.y - 35}
                x2={ropeState.handle.x - 30}
                y2={ropeState.handle.y - 20}
                stroke="#7f1d1d"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* 물리 탄성 줄 */}
              <path
                d={`M ${ropeState.handle.x} ${ropeState.handle.y} Q ${ropeState.mid.x} ${ropeState.mid.y}, ${ropeState.pendant.x} ${ropeState.pendant.y}`}
                stroke="#475569"
                strokeWidth="2.5"
                fill="none"
              />

              {/* 펜던트 */}
              {selectedToolId === 'wand' && (
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <rect x="-22" y="-12" width="44" height="34" rx="12" fill="#f43f5e" opacity="0.9" stroke="#e11d48" strokeWidth="2.5" />
                  <ellipse cx="0" cy="0" rx="12" ry="7" fill="#fb7185" />
                </g>
              )}

              {selectedToolId === 'mouse' && (
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <ellipse cx="0" cy="0" rx="20" ry="12" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
                  <circle cx="12" cy="-7" r="5" fill="#f472b6" />
                  <circle cx="7" cy="-2" r="2" fill="#0f172a" />
                  <circle cx="0" cy="13" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                </g>
              )}

              {selectedToolId === 'yarn' && (
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <circle cx="0" cy="0" r="18" fill="#ec4899" stroke="#be123c" strokeWidth="2.5" />
                  <path d="M -12 -6 Q 0 12, 12 -6" stroke="#fbcfe8" strokeWidth="2.5" fill="none" />
                </g>
              )}
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
