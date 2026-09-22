'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CatData, CatColor, CatPattern, CatAccessories, ScreenMode, FoodItem, PlayTool, SyncStatus } from '@/types/game';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { soundEngine } from '@/lib/audio';
import confetti from 'canvas-confetti';

const DEFAULT_CAT: CatData = {
  name: '다이아냥',
  hunger: 70,
  happiness: 80,
  affection: 50,
  level: 1,
  color: 'orange',
  pattern: 'stripes',
  accessories: {
    ears: 'none',
    neck: 'bell',
    hat: 'none',
    glasses: 'none',
  },
};

interface GameContextType {
  cat: CatData;
  screen: ScreenMode;
  syncStatus: SyncStatus;
  isEating: boolean;
  isPurring: boolean;
  isExcited: boolean;
  activeFood: FoodItem | null;
  setScreen: (mode: ScreenMode) => void;
  feedCat: (food: FoodItem) => void;
  playWithTool: (tool: PlayTool, intensity?: number) => void;
  petCat: () => void;
  updateAppearance: (params: { color?: CatColor; pattern?: CatPattern; accessories?: Partial<CatAccessories> }) => void;
  renameCat: (name: string) => void;
  resetCat: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user, isConfigured } = useAuth();
  const [cat, setCat] = useState<CatData>(DEFAULT_CAT);
  const [screen, setScreenState] = useState<ScreenMode>('main');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local_only');

  // 인터랙션 애니메이션 플래그
  const [isEating, setIsEating] = useState(false);
  const [isPurring, setIsPurring] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setScreen = (mode: ScreenMode) => {
    soundEngine.playClick();
    setScreenState(mode);
  };

  // 1. 초기 로컬스토리지 또는 Supabase 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 로컬 백업 로드
    const cached = localStorage.getItem('cat_app_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCat((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse local cat cache', e);
      }
    }

    // Supabase 로그인 상태라면 DB에서 로드
    if (isConfigured && user) {
      setSyncStatus('saving');
      supabase
        .from('cats')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCat({
              id: data.id,
              user_id: data.user_id,
              name: data.name,
              hunger: data.hunger,
              happiness: data.happiness,
              affection: data.affection,
              level: data.level,
              color: data.color as CatColor,
              pattern: data.pattern as CatPattern,
              accessories: data.accessories as CatAccessories,
              updated_at: data.updated_at,
            });
            setSyncStatus('saved');
          } else if (error && error.code === 'PGRST116') {
            // 아직 고양이가 없는 신규 회원이면 기본 고양이 DB 생성
            const initialCat = { ...DEFAULT_CAT, user_id: user.id };
            supabase
              .from('cats')
              .insert([initialCat])
              .select()
              .single()
              .then(({ data: createdCat }) => {
                if (createdCat) {
                  setCat(createdCat);
                  setSyncStatus('saved');
                }
              });
          } else {
            setSyncStatus('error');
          }
        });
    } else {
      setSyncStatus('local_only');
    }
  }, [user, isConfigured]);

  // 2. 고양이 상태 변경 시 자동 저장 (디바운싱 600ms)
  const persistCat = useCallback(
    (newCat: CatData) => {
      // 로컬 스토리지 즉각 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('cat_app_data', JSON.stringify(newCat));
      }

      if (!isConfigured || !user) {
        setSyncStatus('local_only');
        return;
      }

      setSyncStatus('saving');
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('cats')
            .upsert({
              user_id: user.id,
              name: newCat.name,
              hunger: newCat.hunger,
              happiness: newCat.happiness,
              affection: newCat.affection,
              level: newCat.level,
              color: newCat.color,
              pattern: newCat.pattern,
              accessories: newCat.accessories,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (error) {
            console.error('Supabase save error:', error);
            setSyncStatus('error');
          } else {
            setSyncStatus('saved');
          }
        } catch (err) {
          console.error('Error saving to supabase:', err);
          setSyncStatus('error');
        }
      }, 600);
    },
    [user, isConfigured]
  );

  // 레벨업 체크
  const checkLevelUp = (currentAffection: number, currentLevel: number): { newAffection: number; newLevel: number; leveledUp: boolean } => {
    let aff = currentAffection;
    let lvl = currentLevel;
    let leveledUp = false;

    // 100 친밀도 도달 시 레벨업
    if (aff >= 100) {
      lvl += 1;
      aff = Math.max(0, aff - 100);
      leveledUp = true;
    }

    return { newAffection: aff, newLevel: lvl, leveledUp };
  };

  // A. 먹이주기
  const feedCat = (food: FoodItem) => {
    if (isEating) return;

    setActiveFood(food);
    setIsEating(true);

    if (food.id === 'water') {
      soundEngine.playLick();
    } else if (food.id === 'catnip') {
      soundEngine.playPurr();
      soundEngine.playMeow(1.2);
    } else {
      soundEngine.playMunch();
    }

    setCat((prev) => {
      const nextHunger = Math.min(100, prev.hunger + food.hungerBoost);
      const nextHappiness = Math.min(100, prev.happiness + food.happinessBoost);
      const rawAffection = prev.affection + food.affectionBoost;

      const { newAffection, newLevel, leveledUp } = checkLevelUp(rawAffection, prev.level);

      if (leveledUp) {
        soundEngine.playLevelUp();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }

      const updated = {
        ...prev,
        hunger: nextHunger,
        happiness: nextHappiness,
        affection: newAffection,
        level: newLevel,
      };
      persistCat(updated);
      return updated;
    });

    // 2.2초 후 먹는 모션 종료
    setTimeout(() => {
      setIsEating(false);
      setActiveFood(null);
    }, 2200);
  };

  // B. 놀아주기
  const playWithTool = (tool: PlayTool, intensity: number = 1) => {
    setIsExcited(true);

    if (tool.id === 'laser') {
      soundEngine.playLaser();
    } else if (tool.id === 'mouse') {
      soundEngine.playBell();
    } else {
      soundEngine.playWhoosh();
    }

    setCat((prev) => {
      const nextHappiness = Math.min(100, prev.happiness + Math.round(15 * intensity));
      const nextHunger = Math.max(0, prev.hunger - 4); // 놀면 배고파짐
      const rawAffection = prev.affection + Math.round(10 * intensity);

      const { newAffection, newLevel, leveledUp } = checkLevelUp(rawAffection, prev.level);

      if (leveledUp) {
        soundEngine.playLevelUp();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }

      const updated = {
        ...prev,
        happiness: nextHappiness,
        hunger: nextHunger,
        affection: newAffection,
        level: newLevel,
      };
      persistCat(updated);
      return updated;
    });

    setTimeout(() => {
      setIsExcited(false);
    }, 800);
  };

  // C. 쓰다듬기 (메인 화면)
  const petCat = () => {
    setIsPurring(true);
    soundEngine.playPurr();
    soundEngine.playMeow(1.1);

    setCat((prev) => {
      const nextHappiness = Math.min(100, prev.happiness + 5);
      const rawAffection = prev.affection + 6;
      const { newAffection, newLevel, leveledUp } = checkLevelUp(rawAffection, prev.level);

      if (leveledUp) {
        soundEngine.playLevelUp();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }

      const updated = {
        ...prev,
        happiness: nextHappiness,
        affection: newAffection,
        level: newLevel,
      };
      persistCat(updated);
      return updated;
    });

    setTimeout(() => {
      setIsPurring(false);
    }, 1500);
  };

  // D. 외형 변경
  const updateAppearance = ({
    color,
    pattern,
    accessories,
  }: {
    color?: CatColor;
    pattern?: CatPattern;
    accessories?: Partial<CatAccessories>;
  }) => {
    setCat((prev) => {
      const updated: CatData = {
        ...prev,
        color: color ?? prev.color,
        pattern: pattern ?? prev.pattern,
        accessories: accessories ? { ...prev.accessories, ...accessories } : prev.accessories,
      };
      persistCat(updated);
      return updated;
    });
  };

  // E. 이름 변경
  const renameCat = (name: string) => {
    if (!name.trim()) return;
    setCat((prev) => {
      const updated = { ...prev, name: name.trim() };
      persistCat(updated);
      return updated;
    });
  };

  // F. 리셋
  const resetCat = () => {
    setCat(DEFAULT_CAT);
    persistCat(DEFAULT_CAT);
  };

  return (
    <GameContext.Provider
      value={{
        cat,
        screen,
        syncStatus,
        isEating,
        isPurring,
        isExcited,
        activeFood,
        setScreen,
        feedCat,
        playWithTool,
        petCat,
        updateAppearance,
        renameCat,
        resetCat,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
