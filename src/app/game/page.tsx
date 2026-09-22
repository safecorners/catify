'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { StudioHeader } from '@/components/GameStudio/StudioHeader';
import { StudioHUD } from '@/components/GameStudio/StudioHUD';
import { StudioDock, StudioMode } from '@/components/GameStudio/StudioDock';
import { StudioStage } from '@/components/GameStudio/StudioStage';
import { PlayToolType } from '@/types/game';
import { Sparkles } from 'lucide-react';

function StudioRoom() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [currentMode, setCurrentMode] = useState<StudioMode>('room');
  const [selectedToolId, setSelectedToolId] = useState<PlayToolType>('wand');

  // 인증 가드 (Auth Guard): 비로그인 사용자는 /login으로 자동 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[100dvh] bg-[#faf9f6] flex flex-col items-center justify-center text-stone-700">
        <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center mb-4 animate-spin">
          <Sparkles size={24} />
        </div>
        <p className="text-xs font-extrabold tracking-wider uppercase text-stone-500">
          다이아냥 스튜디오 로딩 중...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#faf9f6] text-stone-900 overflow-hidden">
      {/* 상단 컨트롤 바 */}
      <StudioHeader />

      {/* 좌측 컨디션 스탯 HUD */}
      <StudioHUD />

      {/* 우측 액션 모드 독 */}
      <StudioDock
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        selectedToolId={selectedToolId}
        onSelectTool={(tool) => setSelectedToolId(tool.id)}
      />

      {/* 중앙 풀스크린 인터랙션 스테이지 */}
      <StudioStage currentMode={currentMode} selectedToolId={selectedToolId} />
    </div>
  );
}

export default function GamePage() {
  return (
    <AuthProvider>
      <GameProvider>
        <StudioRoom />
      </GameProvider>
    </AuthProvider>
  );
}
