'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { PlayTool, PlayToolType } from '@/types/game';
import { ToyRopePhysics } from '@/lib/physics';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { StatBar } from '@/components/UI/StatBar';

const PLAY_TOOLS: PlayTool[] = [
  {
    id: 'wand',
    name: '깃털 낚싯대',
    description: '살랑살랑 흔들리는 매혹적인 깃털',
    icon: '🪶',
    color: '#ef4444',
  },
  {
    id: 'laser',
    name: '레이저 포인터',
    description: '재빠르게 움직이는 매혹적인 붉은 점',
    icon: '🔴',
    color: '#dc2626',
  },
  {
    id: 'mouse',
    name: '방울 딸랑 쥐',
    description: '흔들면 딸랑딸랑 소리나는 쥐 인형',
    icon: '🐭',
    color: '#f59E0b',
  },
  {
    id: 'yarn',
    name: '털실 뭉치',
    description: '통통 튀는 푹신한 털실 공',
    icon: '🧶',
    color: '#ec4899',
  },
];

export function PlayScreen() {
  const { cat, setScreen, playWithTool, isExcited } = useGame();
  const [selectedToolId, setSelectedToolId] = useState<PlayToolType>('wand');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const physicsRef = useRef<ToyRopePhysics>(new ToyRopePhysics(140, 100));
  const [ropeState, setRopeState] = useState({
    handle: { x: 140, y: 80 },
    mid: { x: 140, y: 140 },
    pendant: { x: 140, y: 190 },
    isShaking: false,
  });

  const [pounceStreak, setPounceStreak] = useState(0);
  const [showPounceText, setShowPounceText] = useState(false);
  const lastShakeTimeRef = useRef<number>(0);

  const selectedTool = PLAY_TOOLS.find((t) => t.id === selectedToolId) || PLAY_TOOLS[0];

  // 물리 애니메이션 루프
  useEffect(() => {
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

      // 빠른 흔들림 감지 시 인터랙션 발동 (디바운스 400ms)
      const now = Date.now();
      if (shaking && now - lastShakeTimeRef.current > 400) {
        lastShakeTimeRef.current = now;
        playWithTool(selectedTool, 1.2);

        setPounceStreak((prev) => {
          const next = prev + 1;
          if (next % 3 === 0) {
            setShowPounceText(true);
            setTimeout(() => setShowPounceText(false), 900);
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedTool, playWithTool]);

  // 마우스/터치 이동 처리
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 핸들 이동 영역 제한
    const clampedX = Math.max(30, Math.min(rect.width - 30, x));
    const clampedY = Math.max(30, Math.min(rect.height * 0.7, y));

    physicsRef.current.updateHandle(clampedX, clampedY);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative select-none">
      {/* 상단: 상태 게이지 및 타이틀 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">🎣</span> 놀아주기
          </h2>
          <span className="text-[11px] text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Sparkles size={12} />
            마우스나 손가락으로 흔들어보세요!
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatBar label="행복도" value={cat.happiness} icon="💖" colorClass="bg-rose-500" />
          <StatBar label="친밀도" value={cat.affection} icon="⭐" colorClass="bg-indigo-500" />
        </div>
      </div>

      {/* 중앙: 장난감 흔들기 인터랙션 캔버스 (스케치 하단 우측 화면) */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="flex-1 relative my-2 rounded-3xl bg-amber-50/30 border border-amber-100/80 overflow-hidden cursor-grab active:cursor-grabbing touch-none flex items-center justify-between"
      >
        {/* 안내 텍스트 */}
        <div className="absolute top-2 left-3 text-[11px] text-slate-400 font-medium pointer-events-none flex items-center gap-1">
          <span>흔들 수 있어야함</span>
          {ropeState.isShaking && (
            <span className="text-rose-500 font-bold animate-pulse">★ 슉슉! 흔드는 중!</span>
          )}
        </div>

        {/* 덮치기 성공 팡파르 */}
        {showPounceText && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 bg-rose-500 text-white font-black text-sm px-4 py-1 rounded-full shadow-lg animate-bounce">
            덮치기 성공! 🐾
          </div>
        )}

        {/* 인터랙티브 장난감 물리 SVG (Wand + Rope + Pendant) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {selectedTool.id === 'laser' ? (
            // 레이저 포인터 모드: 핸들에서 레이저 빔 발사
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
              {/* 바닥 레이저 빨간 점 */}
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="7" fill="#ef4444" className="animate-ping" />
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="5" fill="#dc2626" />
              <circle cx={ropeState.pendant.x} cy={ropeState.pendant.y + 40} r="2" fill="#ffffff" />
            </g>
          ) : (
            // 일반 낚싯대 줄 & 펜던트
            <g>
              {/* 1. 낚싯대 막대기 (Rod Stick - 스케치의 붉은 막대) */}
              <line
                x1={ropeState.handle.x - 45}
                y1={ropeState.handle.y - 30}
                x2={ropeState.handle.x}
                y2={ropeState.handle.y}
                stroke="#dc2626"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* 손잡이 그립 */}
              <line
                x1={ropeState.handle.x - 45}
                y1={ropeState.handle.y - 30}
                x2={ropeState.handle.x - 25}
                y2={ropeState.handle.y - 17}
                stroke="#7f1d1d"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* 2. 탄성 줄 (Rope Curve) */}
              <path
                d={`M ${ropeState.handle.x} ${ropeState.handle.y} Q ${ropeState.mid.x} ${ropeState.mid.y}, ${ropeState.pendant.x} ${ropeState.pendant.y}`}
                stroke="#475569"
                strokeWidth="2"
                fill="none"
              />

              {/* 3. 펜던트 장난감 (깃털 / 쥐 / 털실) */}
              {selectedTool.id === 'wand' && (
                // 깃털 펜던트 (스케치의 사각/풍성한 깃털 모양)
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="28"
                    rx="10"
                    fill="#f43f5e"
                    opacity="0.85"
                    stroke="#e11d48"
                    strokeWidth="2"
                  />
                  <path d="M -12 18 Q 0 28, 12 18" stroke="#be123c" strokeWidth="2" fill="none" />
                  <ellipse cx="0" cy="0" rx="10" ry="6" fill="#fb7185" />
                </g>
              )}

              {selectedTool.id === 'mouse' && (
                // 방울 쥐 인형
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <ellipse cx="0" cy="0" rx="16" ry="10" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                  <circle cx="10" cy="-6" r="4" fill="#f472b6" />
                  <circle cx="6" cy="-2" r="1.5" fill="#0f172a" />
                  <path d="M -16 0 Q -24 -8, -22 6" stroke="#475569" strokeWidth="2" fill="none" />
                  {/* 방울 */}
                  <circle cx="0" cy="11" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                </g>
              )}

              {selectedTool.id === 'yarn' && (
                // 털실 뭉치
                <g transform={`translate(${ropeState.pendant.x}, ${ropeState.pendant.y})`}>
                  <circle cx="0" cy="0" r="15" fill="#ec4899" stroke="#be123c" strokeWidth="2" />
                  <path d="M -10 -5 Q 0 10, 10 -5 M -8 8 Q 8 8, 4 -10" stroke="#fbcfe8" strokeWidth="2" fill="none" />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* 고양이 캐릭터 (우측 하단에서 장난감을 노려보며 신나서 덮치는 스케치 레이아웃) */}
        <div className="absolute right-0 bottom-0 z-10">
          <GeometricCat
            color={cat.color}
            pattern={cat.pattern}
            accessories={cat.accessories}
            isExcited={isExcited}
            lookTarget={ropeState.pendant}
            size={180}
          />
        </div>

        {/* 우측 상단: 도구 선택 메뉴 (스케치: '도구선택' 및 세로 버튼들) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-30">
          <div className="text-[10px] font-extrabold text-slate-500 text-right pr-1">도구선택</div>
          {PLAY_TOOLS.map((tool) => {
            const isSelected = selectedToolId === tool.id;
            return (
              <button
                key={tool.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedToolId(tool.id);
                  playWithTool(tool, 0.5);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between gap-1.5 transition-all border shadow-xs ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-102'
                    : 'bg-white/95 text-slate-700 hover:bg-rose-50 border-slate-200'
                }`}
              >
                <span>{tool.icon}</span>
                <span className="text-[11px] font-semibold">{tool.name.split(' ')[0]}</span>
                {isSelected && <Check size={12} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단: 뒤로가기 버튼 */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={() => setScreen('main')}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-2xl transition-all text-xs border border-slate-200/80 shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>뒤로가기</span>
        </button>
      </div>
    </div>
  );
}
