'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { FoodItem, PlayTool, PlayToolType, CatColor, CatPattern, CatAccessories } from '@/types/game';
import {
  Utensils,
  Gamepad2,
  Sparkles,
  Home,
  Check,
  Palette,
  Layers,
  Gift,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export type StudioMode = 'room' | 'feed' | 'play' | 'customize';

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

const PLAY_TOOLS: PlayTool[] = [
  { id: 'wand', name: '깃털 낚싯대', description: '살랑살랑 흔들리는 깃털', icon: '🪶', color: '#ef4444' },
  { id: 'laser', name: '레이저 포인터', description: '매혹적인 붉은 점', icon: '🔴', color: '#dc2626' },
  { id: 'mouse', name: '방울 딸랑 쥐', description: '딸랑거리는 쥐 인형', icon: '🐭', color: '#f59e0b' },
  { id: 'yarn', name: '털실 뭉치', description: '통통 튀는 털실 공', icon: '🧶', color: '#ec4899' },
];

const COLOR_OPTIONS: { id: CatColor; name: string; hex: string }[] = [
  { id: 'orange', name: '치즈', hex: '#fbbf24' },
  { id: 'black', name: '올블랙', hex: '#262626' },
  { id: 'coral', name: '코랄레드', hex: '#f87171' },
  { id: 'white', name: '순백색', hex: '#ffffff' },
  { id: 'gray', name: '실버그레이', hex: '#94a3b8' },
  { id: 'cream', name: '버터크림', hex: '#fef08a' },
];

const PATTERN_OPTIONS: { id: CatPattern; name: string; preview: string }[] = [
  { id: 'stripes', name: '줄무늬', preview: 'linear-gradient(45deg, #f59e0b 25%, #d97706 25%, #d97706 50%, #f59e0b 50%, #f59e0b 75%, #d97706 75%, #d97706 100%)' },
  { id: 'patches', name: '얼룩/삼색', preview: 'radial-gradient(circle at 30% 30%, #ef4444 30%, #f59e0b 31%, #f59e0b 60%, #1e293b 61%)' },
  { id: 'tuxedo', name: '턱시도', preview: 'linear-gradient(to bottom, #1e293b 60%, #ffffff 60%)' },
  { id: 'solid', name: '단색', preview: '#fbbf24' },
];

interface StudioDockProps {
  currentMode: StudioMode;
  onSelectMode: (mode: StudioMode) => void;
  selectedToolId: PlayToolType;
  onSelectTool: (tool: PlayTool) => void;
}

export function StudioDock({
  currentMode,
  onSelectMode,
  selectedToolId,
  onSelectTool,
}: StudioDockProps) {
  const { cat, feedCat, isEating, updateAppearance } = useGame();
  const [customTab, setCustomTab] = useState<'color' | 'pattern' | 'accessory'>('color');

  return (
    <aside className="fixed right-4 sm:right-8 top-24 z-30 w-64 sm:w-72">
      {/* Outer Shell (Double-Bezel) */}
      <div className="p-2 rounded-[2rem] bg-stone-900/[0.03] ring-1 ring-stone-900/[0.06] backdrop-blur-md shadow-[0_15px_35px_-10px_rgba(28,25,23,0.06)]">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.5rem)] bg-white/90 inner-highlight p-4 space-y-3 border border-white/60">
          {/* 상단 모드 전환 탭 4종 */}
          <div className="grid grid-cols-4 gap-1 bg-stone-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('room');
              }}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                currentMode === 'room' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="룸 뷰"
            >
              <Home size={15} />
              <span className="text-[9px] font-bold mt-0.5">룸</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('feed');
              }}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                currentMode === 'feed' ? 'bg-amber-500 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="먹이주기"
            >
              <Utensils size={15} />
              <span className="text-[9px] font-bold mt-0.5">먹이</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('play');
              }}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                currentMode === 'play' ? 'bg-rose-500 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="놀아주기"
            >
              <Gamepad2 size={15} />
              <span className="text-[9px] font-bold mt-0.5">놀이</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('customize');
              }}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                currentMode === 'customize' ? 'bg-purple-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="꾸미기"
            >
              <Sparkles size={15} />
              <span className="text-[9px] font-bold mt-0.5">꾸미기</span>
            </button>
          </div>

          {/* 모드별 세부 제어 패널 */}
          {currentMode === 'room' && (
            <div className="py-3 px-2 text-center">
              <span className="text-xs font-bold text-stone-700 block mb-1">다이아냥 스튜디오 룸</span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                화면 중앙의 고양이를 자유롭게 터치하여 교감하거나, 상단 탭에서 먹이주기 · 놀아주기 · 꾸미기를 선택하세요.
              </p>
            </div>
          )}

          {/* 1. 먹이주기 모드 */}
          {currentMode === 'feed' && (
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-stone-400">원클릭 음식 급여</div>
              <div className="grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto pr-0.5">
                {FOOD_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    disabled={isEating}
                    onClick={() => feedCat(item)}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 disabled:opacity-50 border border-stone-200/80 text-left transition-all flex items-center justify-between active:scale-98 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-800">{item.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-stone-500">{item.effectText}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded">
                      급여
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. 놀아주기 모드 */}
          {currentMode === 'play' && (
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-stone-400">도구 선택</div>
              <div className="grid grid-cols-1 gap-1.5">
                {PLAY_TOOLS.map((tool) => {
                  const isSelected = selectedToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        soundEngine.playClick();
                        onSelectTool(tool);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between active:scale-98 shadow-2xs ${
                        isSelected
                          ? 'bg-rose-500 border-rose-600 text-white font-bold'
                          : 'bg-stone-50 hover:bg-rose-50 border-stone-200/80 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tool.icon}</span>
                        <div>
                          <div className="text-xs font-bold">{tool.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-rose-100' : 'text-stone-500'}`}>
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={14} className="text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="p-2 rounded-lg bg-rose-50 text-[10px] font-semibold text-rose-700 text-center">
                화면 전체에서 마우스나 손가락으로 장난감을 흔들어보세요!
              </div>
            </div>
          )}

          {/* 3. 꾸미기 모드 */}
          {currentMode === 'customize' && (
            <div className="space-y-2.5">
              {/* 꾸미기 카테고리 탭 */}
              <div className="flex bg-stone-100 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setCustomTab('color');
                  }}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                    customTab === 'color' ? 'bg-white text-purple-700 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Palette size={11} />
                  <span>색상</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setCustomTab('pattern');
                  }}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                    customTab === 'pattern' ? 'bg-white text-purple-700 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Layers size={11} />
                  <span>무늬</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setCustomTab('accessory');
                  }}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                    customTab === 'accessory' ? 'bg-white text-purple-700 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  <Gift size={11} />
                  <span>장식</span>
                </button>
              </div>

              {/* 털 색상 */}
              {customTab === 'color' && (
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        soundEngine.playClick();
                        updateAppearance({ color: c.id });
                      }}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        cat.color === c.id ? 'ring-2 ring-purple-600 scale-105 shadow-xs' : 'hover:scale-95'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span
                        className={`text-[9px] font-bold ${
                          c.id === 'white' || c.id === 'cream' ? 'text-stone-800' : 'text-white'
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 줄무늬/패턴 */}
              {customTab === 'pattern' && (
                <div className="grid grid-cols-2 gap-2">
                  {PATTERN_OPTIONS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        soundEngine.playClick();
                        updateAppearance({ pattern: p.id });
                      }}
                      className={`h-11 rounded-xl p-1 border text-center transition-all ${
                        cat.pattern === p.id ? 'ring-2 ring-purple-600 scale-105 shadow-xs' : 'hover:scale-95'
                      }`}
                      style={{ background: p.preview, backgroundSize: '20px 20px' }}
                    >
                      <div className="bg-black/60 rounded py-0.5 text-[9px] font-bold text-white">
                        {p.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 악세사리 */}
              {customTab === 'accessory' && (
                <div className="space-y-2 text-[10px] max-h-56 overflow-y-auto pr-0.5">
                  <div>
                    <div className="font-bold text-stone-600 mb-1">🎀 귀 장식</div>
                    <div className="grid grid-cols-3 gap-1">
                      {(['ribbon', 'flower', 'none'] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            soundEngine.playClick();
                            updateAppearance({ accessories: { ears: v } });
                          }}
                          className={`py-1 rounded border font-bold ${
                            cat.accessories.ears === v ? 'bg-purple-600 text-white' : 'bg-stone-50 text-stone-700'
                          }`}
                        >
                          {v === 'ribbon' ? '리본' : v === 'flower' ? '꽃' : '없음'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-stone-600 mb-1">🔔 목 장식</div>
                    <div className="grid grid-cols-3 gap-1">
                      {(['bell', 'bowtie', 'none'] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            soundEngine.playClick();
                            updateAppearance({ accessories: { neck: v } });
                          }}
                          className={`py-1 rounded border font-bold ${
                            cat.accessories.neck === v ? 'bg-purple-600 text-white' : 'bg-stone-50 text-stone-700'
                          }`}
                        >
                          {v === 'bell' ? '방울' : v === 'bowtie' ? '나비넥' : '없음'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-stone-600 mb-1">🎩 모자 & 안경</div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          updateAppearance({
                            accessories: { hat: cat.accessories.hat === 'party' ? 'none' : 'party' },
                          });
                        }}
                        className={`py-1 rounded border font-bold ${
                          cat.accessories.hat === 'party' ? 'bg-purple-600 text-white' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        파티모자
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          updateAppearance({
                            accessories: { glasses: cat.accessories.glasses === 'sunglasses' ? 'none' : 'sunglasses' },
                          });
                        }}
                        className={`py-1 rounded border font-bold ${
                          cat.accessories.glasses === 'sunglasses' ? 'bg-purple-600 text-white' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        선글라스
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
