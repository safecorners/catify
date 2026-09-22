export type CatColor = 'orange' | 'black' | 'coral' | 'white' | 'gray' | 'cream';

export type CatPattern = 'stripes' | 'patches' | 'solid' | 'tuxedo';

export interface CatAccessories {
  ears: 'none' | 'ribbon' | 'flower';
  neck: 'none' | 'bell' | 'bowtie' | 'bandana';
  hat: 'none' | 'party' | 'straw';
  glasses: 'none' | 'sunglasses' | 'round';
}

export interface CatData {
  id?: string;
  user_id?: string;
  name: string;
  hunger: number;     // 0 ~ 100 (포만감)
  happiness: number;  // 0 ~ 100 (행복도)
  affection: number;  // 0 ~ 100 (친밀도)
  level: number;      // 레벨 (1부터 시작)
  color: CatColor;
  pattern: CatPattern;
  accessories: CatAccessories;
  updated_at?: string;
}

export type ScreenMode = 'main' | 'feed' | 'play' | 'customize';

export type FoodType = 'kibble' | 'catnip' | 'churu' | 'water';

export interface FoodItem {
  id: FoodType;
  name: string;
  description: string;
  icon: string;
  hungerBoost: number;
  happinessBoost: number;
  affectionBoost: number;
  effectText: string;
}

export type PlayToolType = 'wand' | 'laser' | 'mouse' | 'yarn';

export interface PlayTool {
  id: PlayToolType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export type SyncStatus = 'saved' | 'saving' | 'local_only' | 'error';
