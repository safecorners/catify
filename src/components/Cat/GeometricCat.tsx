'use client';

import React, { useMemo } from 'react';
import { CatColor, CatPattern, CatAccessories } from '@/types/game';

interface GeometricCatProps {
  color: CatColor;
  pattern: CatPattern;
  accessories: CatAccessories;
  isEating?: boolean;
  isPurring?: boolean;
  isExcited?: boolean;
  lookTarget?: { x: number; y: number } | null;
  className?: string;
  size?: number;
  onClick?: () => void;
}

export function GeometricCat({
  color = 'orange',
  pattern = 'stripes',
  accessories = { ears: 'none', neck: 'bell', hat: 'none', glasses: 'none' },
  isEating = false,
  isPurring = false,
  isExcited = false,
  lookTarget = null,
  className = '',
  size = 280,
  onClick,
}: GeometricCatProps) {
  // 1. 색상 매핑
  const colorScheme = useMemo(() => {
    switch (color) {
      case 'black':
        return {
          body: '#262626',
          stroke: '#171717',
          innerEar: '#f472b6',
          pattern: '#404040',
          accent: '#ffffff',
        };
      case 'white':
        return {
          body: '#ffffff',
          stroke: '#334155',
          innerEar: '#fbcfe8',
          pattern: '#cbd5e1',
          accent: '#0f172a',
        };
      case 'coral':
        return {
          body: '#f87171',
          stroke: '#991b1b',
          innerEar: '#fecdd3',
          pattern: '#dc2626',
          accent: '#ffffff',
        };
      case 'gray':
        return {
          body: '#94a3b8',
          stroke: '#334155',
          innerEar: '#fbcfe8',
          pattern: '#64748b',
          accent: '#0f172a',
        };
      case 'cream':
        return {
          body: '#fef08a',
          stroke: '#854d0e',
          innerEar: '#fecdd3',
          pattern: '#facc15',
          accent: '#713f12',
        };
      case 'orange':
      default:
        return {
          body: '#fbbf24',
          stroke: '#78350f',
          innerEar: '#fbcfe8',
          pattern: '#d97706',
          accent: '#78350f',
        };
    }
  }, [color]);

  // 2. 시선 추적 오프셋 계산 (Play 모드에서 장난감 추적)
  const eyeOffset = useMemo(() => {
    if (!lookTarget) return { x: 0, y: 0 };
    // 중심점 (150, 120) 기준
    const dx = lookTarget.x - 150;
    const dy = lookTarget.y - 120;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x: 0, y: 0 };
    const maxOffset = 6;
    return {
      x: (dx / dist) * Math.min(dist * 0.05, maxOffset),
      y: (dy / dist) * Math.min(dist * 0.05, maxOffset),
    };
  }, [lookTarget]);

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer transition-transform duration-300 ${className} ${
        isExcited ? 'scale-110 -translate-y-4' : ''
      } ${isEating ? 'translate-y-3' : ''}`}
      style={{ width: size, height: size * 1.15 }}
      title="고양이를 클릭해 쓰다듬어 보세요!"
    >
      {/* 골골송 & 행복 하트 파티클 */}
      {isPurring && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none animate-bounce">
          <span className="text-2xl text-pink-500 animate-pulse">💖</span>
          <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full shadow-sm">
            골골골...♪
          </span>
          <span className="text-xl text-rose-400">✨</span>
        </div>
      )}

      {/* 캣닢 취함 / 신남 파티클 */}
      {isExcited && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
          <span className="text-2xl animate-spin">🌟</span>
          <span className="text-sm font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full shadow">
            우다다!
          </span>
          <span className="text-2xl animate-pulse">🐾</span>
        </div>
      )}

      {/* 고양이 본체 SVG */}
      <svg
        viewBox="0 0 300 340"
        className={`w-full h-full filter drop-shadow-md transition-all duration-300 ${
          isPurring ? 'animate-[wiggle_0.5s_ease-in-out_infinite]' : ''
        }`}
      >
        <defs>
          {/* 줄무늬 클립/패턴 */}
          <pattern id="stripesPattern" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke={colorScheme.pattern} strokeWidth="4" />
          </pattern>

          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. 꼬리 (Curled tail on the right) */}
        <g className={`origin-[210px_230px] transition-transform duration-500 ${isExcited ? 'animate-[tailFast_0.4s_infinite_alternate]' : 'animate-[tailSlow_2.5s_infinite_alternate]'}`}>
          <path
            d="M 210 230 Q 250 220, 260 190 Q 270 160, 255 145 Q 240 135, 230 150 Q 225 160, 238 165 Q 248 165, 245 185 Q 240 205, 210 220 Z"
            fill={colorScheme.body}
            stroke={colorScheme.stroke}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {pattern === 'stripes' && (
            <path
              d="M 240 185 Q 255 185, 250 175 M 245 205 Q 260 200, 255 195"
              stroke={colorScheme.pattern}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* 2. 몸통 (Body: 스케치의 마름모 / 다이아몬드 형태) */}
        {/* Diamond: (150, 160) top, (220, 230) right, (150, 300) bottom, (80, 230) left */}
        <g>
          <polygon
            points="150,160 220,230 150,300 80,230"
            fill={colorScheme.body}
            stroke={colorScheme.stroke}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* 몸통 패턴 */}
          {pattern === 'stripes' && (
            <g stroke={colorScheme.pattern} strokeWidth="4" strokeLinecap="round">
              {/* 스케치의 가로 줄무늬 그대로 재현 */}
              <line x1="110" y1="210" x2="190" y2="210" />
              <line x1="100" y1="230" x2="200" y2="230" />
              <line x1="115" y1="250" x2="185" y2="250" />
              <line x1="130" y1="270" x2="170" y2="270" />
            </g>
          )}

          {pattern === 'patches' && (
            <g fill={colorScheme.pattern} opacity="0.85">
              <ellipse cx="120" cy="225" rx="20" ry="15" />
              <ellipse cx="175" cy="245" rx="18" ry="22" />
            </g>
          )}

          {pattern === 'tuxedo' && (
            <polygon
              points="150,175 185,230 150,285 115,230"
              fill="#ffffff"
              stroke={colorScheme.stroke}
              strokeWidth="2"
            />
          )}

          {/* 발 (앞발 디테일) */}
          <ellipse cx="125" cy="295" rx="14" ry="8" fill={colorScheme.body} stroke={colorScheme.stroke} strokeWidth="3" />
          <ellipse cx="175" cy="295" rx="14" ry="8" fill={colorScheme.body} stroke={colorScheme.stroke} strokeWidth="3" />
        </g>

        {/* 3. 목 악세사리 (방울 목걸이 / 나비넥타이 / 반다나) */}
        {accessories.neck === 'bell' && (
          <g transform="translate(150, 160)">
            {/* 붉은 리본 끈 */}
            <path d="M -25 -5 Q 0 10, 25 -5" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* 황금 방울 */}
            <circle cx="0" cy="5" r="9" fill="#facc15" stroke="#b45309" strokeWidth="2" />
            <circle cx="0" cy="7" r="2.5" fill="#78350f" />
          </g>
        )}

        {accessories.neck === 'bowtie' && (
          <g transform="translate(150, 162)">
            <polygon points="-16,-6 -16,6 0,0" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <polygon points="16,-6 16,6 0,0" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="#b91c1c" />
          </g>
        )}

        {accessories.neck === 'bandana' && (
          <g transform="translate(150, 160)">
            <polygon points="-30,-4 30,-4 0,22" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <circle cx="0" cy="8" r="2" fill="#ffffff" />
          </g>
        )}

        {/* 4. 귀 장식 / 리본 (스케치 꾸미기 화면 상단에 그려진 귀 리본!) */}
        {accessories.ears === 'ribbon' && (
          <g>
            {/* 왼쪽 귀 리본 */}
            <g transform="translate(100, 50)">
              <ellipse cx="-10" cy="-6" rx="12" ry="7" fill="#f43f5e" transform="rotate(-30)" />
              <ellipse cx="10" cy="6" rx="12" ry="7" fill="#f43f5e" transform="rotate(-30)" />
              <circle cx="0" cy="0" r="5" fill="#be123c" />
            </g>
            {/* 오른쪽 귀 리본 */}
            <g transform="translate(200, 50)">
              <ellipse cx="-10" cy="6" rx="12" ry="7" fill="#f43f5e" transform="rotate(30)" />
              <ellipse cx="10" cy="-6" rx="12" ry="7" fill="#f43f5e" transform="rotate(30)" />
              <circle cx="0" cy="0" r="5" fill="#be123c" />
            </g>
          </g>
        )}

        {accessories.ears === 'flower' && (
          <g transform="translate(195, 45)">
            <circle cx="-6" cy="0" r="5" fill="#f472b6" />
            <circle cx="6" cy="0" r="5" fill="#f472b6" />
            <circle cx="0" cy="-6" r="5" fill="#f472b6" />
            <circle cx="0" cy="6" r="5" fill="#f472b6" />
            <circle cx="0" cy="0" r="4" fill="#fef08a" />
          </g>
        )}

        {/* 5. 귀 (Triangle Ears) */}
        <g>
          {/* 왼쪽 귀 */}
          <polygon
            points="95,95 65,35 125,65"
            fill={colorScheme.body}
            stroke={colorScheme.stroke}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <polygon points="95,88 75,45 118,66" fill={colorScheme.innerEar} />

          {/* 오른쪽 귀 */}
          <polygon
            points="205,95 235,35 175,65"
            fill={colorScheme.body}
            stroke={colorScheme.stroke}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <polygon points="205,88 225,45 182,66" fill={colorScheme.innerEar} />
        </g>

        {/* 6. 머리 (Head: 스케치의 다이아몬드 형태) */}
        {/* Diamond: (150, 50) top, (215, 115) right, (150, 180) bottom, (85, 115) left */}
        <g className={`transition-transform duration-200 ${isEating ? 'translate-y-2' : ''}`}>
          <polygon
            points="150,50 215,115 150,180 85,115"
            fill={colorScheme.body}
            stroke={colorScheme.stroke}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* 이마 줄무늬 */}
          {pattern === 'stripes' && (
            <g stroke={colorScheme.pattern} strokeWidth="3.5" strokeLinecap="round">
              <line x1="150" y1="65" x2="150" y2="80" />
              <line x1="140" y1="75" x2="145" y2="90" />
              <line x1="160" y1="75" x2="155" y2="90" />
            </g>
          )}

          {/* 모자 악세사리 */}
          {accessories.hat === 'party' && (
            <g transform="translate(150, 48)">
              <polygon points="0,-45 -18,0 18,0" fill="#ec4899" stroke="#9d174d" strokeWidth="2" />
              <circle cx="0" cy="-47" r="5" fill="#facc15" />
              <line x1="-12" y1="-15" x2="12" y2="-15" stroke="#facc15" strokeWidth="3" />
              <line x1="-8" y1="-30" x2="8" y2="-30" stroke="#60a5fa" strokeWidth="3" />
            </g>
          )}

          {accessories.hat === 'straw' && (
            <g transform="translate(150, 50)">
              <ellipse cx="0" cy="0" rx="36" ry="10" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
              <path d="M -18 0 Q 0 -22, 18 0 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <path d="M -18 0 Q 0 -5, 18 0" stroke="#ef4444" strokeWidth="3" />
            </g>
          )}

          {/* 볼터치 (Blush) */}
          <circle cx="115" cy="130" r="9" fill="#f43f5e" opacity={isPurring || isExcited ? 0.6 : 0.25} />
          <circle cx="185" cy="130" r="9" fill="#f43f5e" opacity={isPurring || isExcited ? 0.6 : 0.25} />

          {/* 눈 (Eyes) */}
          {isEating || isPurring ? (
            // 행복하게 감은 눈 (스케치 스타일: ^ ^ or ⌒ ⌒)
            <g stroke={colorScheme.stroke} strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 115 115 Q 125 105, 135 115" />
              <path d="M 165 115 Q 175 105, 185 115" />
            </g>
          ) : (
            // 초롱초롱한 눈 + 시선 추적
            <g>
              {/* 왼쪽 눈 */}
              <circle cx="125" cy="115" r="9" fill="#1e293b" />
              <circle cx={125 + eyeOffset.x} cy={115 + eyeOffset.y} r="3" fill="#ffffff" />
              {/* 오른쪽 눈 */}
              <circle cx="175" cy="115" r="9" fill="#1e293b" />
              <circle cx={175 + eyeOffset.x} cy={115 + eyeOffset.y} r="3" fill="#ffffff" />
            </g>
          )}

          {/* 안경 악세사리 */}
          {accessories.glasses === 'sunglasses' && (
            <g transform="translate(150, 115)">
              <polygon points="-35,-8 -10,-8 -12,12 -33,12" fill="#0f172a" stroke="#000" strokeWidth="2" />
              <polygon points="10,-8 35,-8 33,12 12,12" fill="#0f172a" stroke="#000" strokeWidth="2" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#0f172a" strokeWidth="3" />
            </g>
          )}

          {accessories.glasses === 'round' && (
            <g transform="translate(150, 115)">
              <circle cx="-25" cy="0" r="14" fill="none" stroke="#b45309" strokeWidth="2.5" />
              <circle cx="25" cy="0" r="14" fill="none" stroke="#b45309" strokeWidth="2.5" />
              <line x1="-11" y1="0" x2="11" y2="0" stroke="#b45309" strokeWidth="2.5" />
            </g>
          )}

          {/* 코 & 입 (스케치 스타일의 ∧ 또는 입 모양) */}
          <polygon points="150,126 146,122 154,122" fill="#f43f5e" />
          {isEating ? (
            // 우물우물 입
            <ellipse cx="150" cy="134" rx="4" ry="5" fill="#881337" />
          ) : (
            // 귀여운 ⌒ω⌒ 형태
            <path
              d="M 144 130 Q 147 136, 150 131 Q 153 136, 156 130"
              fill="none"
              stroke={colorScheme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* 수염 (Whiskers) */}
          <g stroke={colorScheme.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
            {/* 왼쪽 수염 */}
            <line x1="110" y1="126" x2="85" y2="122" />
            <line x1="108" y1="134" x2="82" y2="136" />
            {/* 오른쪽 수염 */}
            <line x1="190" y1="126" x2="215" y2="122" />
            <line x1="192" y1="134" x2="218" y2="136" />
          </g>
        </g>
      </svg>
    </div>
  );
}
