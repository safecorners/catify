'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import { CatColor, CatPattern, CatAccessories } from '@/types/game';
import { ArrowLeft, Check, Sparkles, Palette, Layers, Gift } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

const COLOR_OPTIONS: { id: CatColor; name: string; hex: string }[] = [
  { id: 'orange', name: '치즈', hex: '#fbbf24' },
  { id: 'black', name: '올블랙', hex: '#262626' },
  { id: 'coral', name: '코랄레드', hex: '#f87171' },
  { id: 'white', name: '순백색', hex: '#ffffff' },
  { id: 'gray', name: '실버그레이', hex: '#94a3b8' },
  { id: 'cream', name: '버터크림', hex: '#fef08a' },
];

const PATTERN_OPTIONS: { id: CatPattern; name: string; preview: string }[] = [
  { id: 'stripes', name: '줄무늬 (태비)', preview: 'linear-gradient(45deg, #f59e0b 25%, #d97706 25%, #d97706 50%, #f59e0b 50%, #f59e0b 75%, #d97706 75%, #d97706 100%)' },
  { id: 'patches', name: '얼룩/삼색', preview: 'radial-gradient(circle at 30% 30%, #ef4444 30%, #f59e0b 31%, #f59e0b 60%, #1e293b 61%)' },
  { id: 'tuxedo', name: '턱시도', preview: 'linear-gradient(to bottom, #1e293b 60%, #ffffff 60%)' },
  { id: 'solid', name: '단색 (솔리드)', preview: '#fbbf24' },
];

export function CustomizeScreen() {
  const { cat, setScreen, updateAppearance } = useGame();
  const [activeTab, setActiveTab] = useState<'color' | 'pattern' | 'accessory'>('color');

  const handleColorChange = (col: CatColor) => {
    soundEngine.playClick();
    updateAppearance({ color: col });
  };

  const handlePatternChange = (pat: CatPattern) => {
    soundEngine.playClick();
    updateAppearance({ pattern: pat });
  };

  const handleAccessoryChange = (type: keyof CatAccessories, value: string) => {
    soundEngine.playClick();
    updateAppearance({
      accessories: {
        [type]: value,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 relative select-none">
      {/* 상단: 타이틀 '꾸미기' */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
          <Sparkles size={18} className="text-purple-500" />
          꾸미기
        </h2>
        <span className="text-[11px] text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full font-bold">
          실시간 스타일링
        </span>
      </div>

      {/* 중앙 레이아웃: 좌측 고양이 프리뷰 + 우측 옵션 팔레트 (스케치 상단 우측 패널) */}
      <div className="flex-1 flex items-center justify-between gap-3 my-2">
        {/* 좌측: 고양이 캐릭터 프리뷰 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* 바닥 그림자 */}
          <div className="absolute bottom-4 w-36 h-7 bg-slate-300/40 rounded-full blur-xs -z-0" />
          <div className="relative z-10 transition-transform duration-300 animate-bob">
            <GeometricCat
              color={cat.color}
              pattern={cat.pattern}
              accessories={cat.accessories}
              size={210}
            />
          </div>
        </div>

        {/* 우측 사이드바: 탭 및 선택 리스트 (스케치: '색상', '줄무늬' 세로 배열) */}
        <div className="w-36 bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-purple-100 shadow-xs flex flex-col gap-2 max-h-[440px] overflow-y-auto">
          {/* 카테고리 탭 (색상 / 줄무늬 / 악세사리) */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('color');
              }}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                activeTab === 'color' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
              }`}
              title="털 색상"
            >
              <Palette size={11} />
              <span>색상</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('pattern');
              }}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                activeTab === 'pattern' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
              }`}
              title="무늬"
            >
              <Layers size={11} />
              <span>줄무늬</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('accessory');
              }}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-0.5 transition-all ${
                activeTab === 'accessory' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
              }`}
              title="악세사리"
            >
              <Gift size={11} />
              <span>장식</span>
            </button>
          </div>

          {/* 1. 색상 선택 팔레트 (스케치: 4가지 사각 색상 스와치) */}
          {activeTab === 'color' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-extrabold text-slate-500">털 색상 선택</div>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = cat.color === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => handleColorChange(col.id)}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center relative border transition-all ${
                        isSelected ? 'ring-2 ring-purple-600 scale-105 shadow-sm' : 'hover:scale-98'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-white">
                          <Check size={12} />
                        </div>
                      )}
                      <span
                        className={`text-[9px] font-bold mt-0.5 ${
                          col.id === 'white' || col.id === 'cream' ? 'text-slate-800' : 'text-white drop-shadow-xs'
                        }`}
                      >
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. 줄무늬 패턴 선택 (스케치: 빗금, 얼룩 등 패턴 스와치) */}
          {activeTab === 'pattern' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-extrabold text-slate-500">무늬 선택</div>
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_OPTIONS.map((pat) => {
                  const isSelected = cat.pattern === pat.id;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => handlePatternChange(pat.id)}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center p-1 border transition-all relative overflow-hidden ${
                        isSelected ? 'ring-2 ring-purple-600 shadow-sm scale-105' : 'hover:scale-98'
                      }`}
                      style={{ background: pat.preview, backgroundSize: '20px 20px' }}
                    >
                      <div className="w-full bg-black/55 backdrop-blur-xs py-0.5 rounded text-center">
                        <span className="text-[9px] font-extrabold text-white">{pat.name.split(' ')[0]}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={9} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. 악세사리 선택 (스케치: 귀 리본, 방울 목걸이, 모자 등) */}
          {activeTab === 'accessory' && (
            <div className="space-y-2 text-[10px]">
              {/* 귀 장식 (스케치에 크게 그려진 귀 리본!) */}
              <div>
                <div className="font-bold text-slate-600 mb-1">🎀 귀 장식</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAccessoryChange('ears', 'ribbon')}
                    className={`py-1.5 px-2 rounded-lg border font-bold ${
                      cat.accessories.ears === 'ribbon' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    귀 리본
                  </button>
                  <button
                    onClick={() => handleAccessoryChange('ears', 'flower')}
                    className={`py-1.5 px-2 rounded-lg border font-bold ${
                      cat.accessories.ears === 'flower' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    꽃 장식
                  </button>
                  <button
                    onClick={() => handleAccessoryChange('ears', 'none')}
                    className={`py-1 px-2 rounded-lg border text-[9px] ${
                      cat.accessories.ears === 'none' ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    장식 없음
                  </button>
                </div>
              </div>

              {/* 목걸이 */}
              <div>
                <div className="font-bold text-slate-600 mb-1">🔔 목 장식</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAccessoryChange('neck', 'bell')}
                    className={`py-1.5 px-2 rounded-lg border font-bold ${
                      cat.accessories.neck === 'bell' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    황금 방울
                  </button>
                  <button
                    onClick={() => handleAccessoryChange('neck', 'bowtie')}
                    className={`py-1.5 px-2 rounded-lg border font-bold ${
                      cat.accessories.neck === 'bowtie' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    나비넥타이
                  </button>
                  <button
                    onClick={() => handleAccessoryChange('neck', 'none')}
                    className={`py-1 px-2 rounded-lg border text-[9px] ${
                      cat.accessories.neck === 'none' ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    목걸이 없음
                  </button>
                </div>
              </div>

              {/* 모자 & 안경 */}
              <div>
                <div className="font-bold text-slate-600 mb-1">🎩 모자 & 안경</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleAccessoryChange('hat', cat.accessories.hat === 'party' ? 'none' : 'party')}
                    className={`py-1 px-1.5 rounded-lg border font-bold ${
                      cat.accessories.hat === 'party' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    파티모자
                  </button>
                  <button
                    onClick={() =>
                      handleAccessoryChange('glasses', cat.accessories.glasses === 'sunglasses' ? 'none' : 'sunglasses')
                    }
                    className={`py-1 px-1.5 rounded-lg border font-bold ${
                      cat.accessories.glasses === 'sunglasses' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    선글라스
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단: 뒤로가기 버튼 (스케치: '뒤로가기') */}
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
