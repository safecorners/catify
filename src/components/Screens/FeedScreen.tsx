'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { FoodItem, FoodType } from '@/types/game';
import { ArrowLeft, Check } from 'lucide-react';
import { StatBar } from '@/components/UI/StatBar';

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'kibble',
    name: '먹이 (사료)',
    description: '맛있고 영양 가득한 참치 캔 사료',
    icon: '🐟',
    hungerBoost: 30,
    happinessBoost: 10,
    affectionBoost: 5,
    effectText: '포만감 +30, 행복도 +10',
  },
  {
    id: 'catnip',
    name: '캣닢 (마따따비)',
    description: '고양이를 극락으로 보내주는 마법의 허브',
    icon: '🌿',
    hungerBoost: 5,
    happinessBoost: 40,
    affectionBoost: 15,
    effectText: '행복도 +40, 친밀도 +15 (헤롱헤롱~)',
  },
  {
    id: 'churu',
    name: '참치 츄르',
    description: '모든 고양이가 사랑하는 특급 간식',
    icon: '🍗',
    hungerBoost: 15,
    happinessBoost: 25,
    affectionBoost: 30,
    effectText: '친밀도 +30, 행복도 +25',
  },
  {
    id: 'water',
    name: '신선한 물',
    description: '시원하고 깨끗한 생수 한 사발',
    icon: '🥛',
    hungerBoost: 10,
    happinessBoost: 5,
    affectionBoost: 5,
    effectText: '포만감 +10 (갈증 해소)',
  },
];

export function FeedScreen() {
  const { cat, setScreen, feedCat, isEating, activeFood } = useGame();
  const [selectedFood, setSelectedFood] = useState<FoodType>('kibble');

  const handleFeed = (food: FoodItem) => {
    setSelectedFood(food.id);
    feedCat(food);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative">
      {/* 상단: 상태 게이지 & 타이틀 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
            <span className="text-xl">🍽️</span> 먹이주기
          </h2>
          <span className="text-[11px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full font-bold">
            원클릭으로 바로 급여!
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatBar label="포만감" value={cat.hunger} icon="🍗" colorClass="bg-amber-500" />
          <StatBar label="행복도" value={cat.happiness} icon="💖" colorClass="bg-rose-500" />
        </div>
      </div>

      {/* 중앙: 고양이 & 먹이 그릇 영역 */}
      <div className="flex-1 relative flex items-center justify-between my-2">
        {/* 고양이 및 바닥 그릇 (스케치: 고양이 왼쪽 앞에 놓인 먹이 그릇) */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          {/* 바닥 그림자 */}
          <div className="absolute bottom-5 w-40 h-8 bg-slate-300/40 rounded-full blur-xs -z-0" />

          {/* 고양이 */}
          <div className={`relative z-10 transition-transform ${isEating ? 'translate-y-2 scale-98' : ''}`}>
            <GeometricCat
              color={cat.color}
              pattern={cat.pattern}
              accessories={cat.accessories}
              isEating={isEating}
              isExcited={activeFood?.id === 'catnip' && isEating}
              size={210}
            />
          </div>

          {/* 먹이 그릇 (스케치의 비스듬한 사각/타원 밥그릇) */}
          <div className="relative -mt-6 z-20 flex flex-col items-center">
            {/* 먹는 리액션 텍스트 말풍선 */}
            {isEating && activeFood && (
              <div className="absolute -top-12 bg-white/95 px-3 py-1 rounded-full shadow-md border border-amber-200 text-xs font-bold text-amber-700 animate-bounce flex items-center gap-1 whitespace-nowrap">
                <span>{activeFood.icon}</span>
                <span>{activeFood.id === 'catnip' ? '뒹굴뒹굴~ 냐아앙!' : '냠냠! 쩝쩝!'}</span>
              </div>
            )}

            {/* 그릇 SVG */}
            <svg width="84" height="40" viewBox="0 0 84 40" className="drop-shadow-sm">
              {/* 그릇 외형 */}
              <ellipse cx="42" cy="22" rx="36" ry="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
              <ellipse cx="42" cy="20" rx="34" ry="12" fill="#f1f5f9" />
              {/* 그릇 내부 음식 */}
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
            <span className="text-[10px] font-bold text-slate-400 mt-0.5">
              {isEating ? '먹는 중...' : '밥그릇'}
            </span>
          </div>
        </div>

        {/* 우측 음식 선택 버튼 목록 (스케치: 먹이, 캣닛 등 세로 버튼) */}
        <div className="w-32 flex flex-col gap-2 z-10">
          {FOOD_ITEMS.map((item) => {
            const isSelected = selectedFood === item.id;
            return (
              <button
                key={item.id}
                disabled={isEating}
                onClick={() => handleFeed(item)}
                className={`p-2.5 rounded-2xl flex items-center justify-between text-left transition-all border shadow-xs ${
                  isSelected
                    ? 'bg-amber-500 border-amber-600 text-white font-bold shadow-md scale-102'
                    : 'bg-white/90 hover:bg-amber-50 border-slate-200 text-slate-700 hover:border-amber-300'
                } ${isEating ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-base">{item.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate leading-tight">{item.name.split(' ')[0]}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                      {item.id === 'catnip' ? '행복+40' : item.id === 'kibble' ? '포만+30' : '친밀+30'}
                    </div>
                  </div>
                </div>
                {isSelected && <Check size={14} className="shrink-0 text-white" />}
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
