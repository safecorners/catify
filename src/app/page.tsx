'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider, useGame } from '@/context/GameContext';
import { PhoneFrame } from '@/components/UI/PhoneFrame';
import { MainScreen } from '@/components/Screens/MainScreen';
import { FeedScreen } from '@/components/Screens/FeedScreen';
import { PlayScreen } from '@/components/Screens/PlayScreen';
import { CustomizeScreen } from '@/components/Screens/CustomizeScreen';

function GameScreenRenderer() {
  const { screen } = useGame();

  switch (screen) {
    case 'feed':
      return <FeedScreen />;
    case 'play':
      return <PlayScreen />;
    case 'customize':
      return <CustomizeScreen />;
    case 'main':
    default:
      return <MainScreen />;
  }
}

export default function Home() {
  return (
    <AuthProvider>
      <GameProvider>
        <PhoneFrame>
          <GameScreenRenderer />
        </PhoneFrame>
      </GameProvider>
    </AuthProvider>
  );
}
