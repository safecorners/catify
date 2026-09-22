'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { StatBar } from '@/components/UI/StatBar';
import { Heart, Sparkles } from 'lucide-react';

export function StudioHUD() {
  const { cat, petCat } = useGame();

  return (
    <aside className="fixed left-4 sm:left-8 top-24 z-30 w-56 sm:w-64">
      {/* Outer Shell (Double-Bezel) */}
      <div className="p-2 rounded-[2rem] bg-stone-900/[0.03] ring-1 ring-stone-900/[0.06] backdrop-blur-md shadow-[0_15px_35px_-10px_rgba(28,25,23,0.06)]">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.5rem)] bg-white/90 inner-highlight p-4 space-y-3 border border-white/60">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-[11px] font-black text-stone-800 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>컨디션 매트릭스</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-stone-400">STATUS</span>
          </div>

          {/* 게이지 바 3종 */}
          <div className="space-y-2">
            <StatBar label="포만감" value={cat.hunger} icon="🍗" colorClass="bg-amber-500" />
            <StatBar label="행복도" value={cat.happiness} icon="💖" colorClass="bg-rose-500" />
            <StatBar label="친밀도" value={cat.affection} icon="⭐" colorClass="bg-indigo-500" />
          </div>

          {/* 쓰다듬기 버튼 */}
          <button
            onClick={petCat}
            className="w-full group py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold border border-stone-200/80 transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500 transition-transform duration-300 group-hover:scale-125" />
            <span>쓰다듬어주기</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
