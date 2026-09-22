'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { StatBar } from '@/components/UI/StatBar';
import { Utensils, Gamepad2, Sparkles, Heart } from 'lucide-react';

export function MainScreen() {
  const { cat, setScreen, petCat, isPurring } = useGame();

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative">
      {/* 상단: 타이틀 '고양이' 및 상태 게이지 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800 tracking-wide flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            고양이
          </h1>
          <span className="text-xs text-amber-700/80 bg-amber-100/60 px-2.5 py-1 rounded-full font-medium">
            터치해서 쓰다듬어주세요
          </span>
        </div>

        {/* 3가지 상태 게이지 (스탯바) */}
        <div className="grid grid-cols-3 gap-2">
          <StatBar label="포만감" value={cat.hunger} icon="🍗" colorClass="bg-amber-500" />
          <StatBar label="행복도" value={cat.happiness} icon="💖" colorClass="bg-rose-500" />
          <StatBar label="친밀도" value={cat.affection} icon="⭐" colorClass="bg-indigo-500" />
        </div>
      </div>

      {/* 중앙: 기하학적 고양이 캐릭터 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-2">
        {/* 바닥 그림자 타원 */}
        <div className="absolute bottom-6 w-44 h-8 bg-slate-300/40 rounded-full blur-xs -z-0" />

        <div className="relative z-10 transition-transform active:scale-95 animate-bob">
          <GeometricCat
            color={cat.color}
            pattern={cat.pattern}
            accessories={cat.accessories}
            isPurring={isPurring}
            size={240}
            onClick={petCat}
          />
        </div>

        {/* 쓰다듬기 안내 팁 */}
        <button
          onClick={petCat}
          className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white/60 hover:bg-white px-3 py-1 rounded-full border border-slate-200/60 shadow-xs transition-all"
        >
          <Heart size={13} className="text-rose-500 fill-rose-500" />
          <span>쓰다듬기</span>
        </button>
      </div>

      {/* 하단/좌측 메뉴 버튼 3종 (스케치: 먹이주기, 놀아주기, 꾸미기) */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setScreen('feed')}
            className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold rounded-2xl shadow-md active:scale-95 transition-all border-b-3 border-amber-600"
          >
            <Utensils size={22} className="mb-1" />
            <span className="text-xs">먹이주기</span>
          </button>

          <button
            onClick={() => setScreen('play')}
            className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all border-b-3 border-rose-600"
          >
            <Gamepad2 size={22} className="mb-1" />
            <span className="text-xs">놀아주기</span>
          </button>

          <button
            onClick={() => setScreen('customize')}
            className="flex flex-col items-center justify-center p-3 bg-gradient-to-b from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all border-b-3 border-purple-600"
          >
            <Sparkles size={22} className="mb-1" />
            <span className="text-xs">꾸미기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
