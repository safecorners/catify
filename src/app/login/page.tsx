'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GeometricCat } from '@/components/Cat/GeometricCat';
import {
  Mail,
  Lock,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

function LoginForm() {
  const router = useRouter();
  const { user, isConfigured, signIn, signUp, quickDemoLogin } = useAuth();

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 시선 추적 좌표
  const [lookTarget, setLookTarget] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 이미 로그인되어 있다면 /game으로 자동 리다이렉트
  useEffect(() => {
    if (user) {
      router.push('/game');
    }
  }, [user, router]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 340;
    setLookTarget({ x, y });
  }, []);

  const translateError = (err: string): string => {
    if (err.includes('Invalid login credentials')) {
      return '이메일 또는 비밀번호가 올바르지 않거나 아직 가입되지 않은 계정입니다. 계정이 없으시다면 [회원가입]을 먼저 진행해주세요!';
    }
    if (err.includes('User already registered')) {
      return '이미 등록된 이메일입니다. [로그인] 탭에서 비밀번호를 입력해주세요.';
    }
    if (err.includes('Password should be at least 6 characters')) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (err.includes('Email not confirmed')) {
      return '이메일 인증이 필요합니다. 메일함을 확인해주세요.';
    }
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (tab === 'login') {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage(translateError(error));
      } else {
        setSuccessMessage('환영합니다! 게임 스튜디오로 입장합니다...');
        setTimeout(() => router.push('/game'), 700);
      }
    } else {
      const { error, hasSession } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage(translateError(error));
      } else {
        if (hasSession) {
          setSuccessMessage('회원가입 및 로그인이 완료되었습니다! 게임 스튜디오로 입장합니다...');
          setTimeout(() => router.push('/game'), 700);
        } else {
          setSuccessMessage('회원가입이 완료되었습니다! 로그인해주세요.');
          setTab('login');
        }
      }
    }
  };

  const handleQuickDemo = async () => {
    soundEngine.playClick();
    setErrorMessage(null);
    setLoading(true);
    const { error } = await quickDemoLogin();
    setLoading(false);
    if (error) {
      setErrorMessage(translateError(error));
    } else {
      setSuccessMessage('체험 계정으로 로그인되었습니다! 입장합니다...');
      setTimeout(() => router.push('/game'), 700);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="min-h-[100dvh] bg-[#faf9f6] text-stone-900 flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden"
    >
      {/* 상단 네비 바 */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto z-20">
        <Link
          href="/"
          onClick={() => soundEngine.playClick()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>메인으로 돌아가기</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
            ✦
          </div>
          <span className="font-extrabold text-sm tracking-tight text-stone-900">다이아냥</span>
        </div>
      </header>

      {/* 중앙: 럭셔리 에디토리얼 스플릿 레이아웃 (Editorial Split) */}
      <div className="max-w-6xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 z-10">
        {/* 좌측 패널: 감각적인 타이포그래피 & 시선 추적 고양이 아트워크 (Col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] bg-amber-100/60 text-amber-900 ring-1 ring-amber-300/40">
            <Sparkles size={11} className="text-amber-600" />
            <span>Digital Pet Atelier</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            반려묘와의 교감이<br />
            시작되는 곳, 다이아냥.
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md leading-relaxed">
            언제 어디서나 함께하는 당신만의 기하학적 고양이. Supabase 계정 연동을 통해 성장 레벨과 정성껏 꾸민 외형이 안전하게 보존됩니다.
          </p>

          {/* 시선 추적 고양이 프리뷰 */}
          <div className="pt-2 animate-bob">
            <GeometricCat
              color="orange"
              pattern="stripes"
              accessories={{ ears: 'ribbon', neck: 'bell', hat: 'none', glasses: 'none' }}
              lookTarget={lookTarget}
              size={210}
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>PostgreSQL RLS 보안</span>
            </span>
            <span>•</span>
            <span>실시간 클라우드 자동 저장</span>
          </div>
        </div>

        {/* 우측 패널: 더블 베젤 럭셔리 인증 카드 (Col-span-5) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          {/* Outer Shell */}
          <div className="p-2.5 rounded-[2.8rem] bg-stone-900/[0.03] ring-1 ring-stone-900/[0.07] shadow-[0_25px_50px_-12px_rgba(28,25,23,0.08)]">
            {/* Inner Core */}
            <div className="rounded-[calc(2.8rem-0.625rem)] bg-white inner-highlight p-7 sm:p-8 border border-white/60">
              {/* 탭 전환 버튼 */}
              <div className="flex bg-stone-100 p-1 rounded-2xl mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setErrorMessage(null);
                    setTab('login');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-300 ease-fluid ${
                    tab === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setErrorMessage(null);
                    setTab('signup');
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-300 ease-fluid ${
                    tab === 'signup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  회원가입
                </button>
              </div>

              {/* 에러 메시지 */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex flex-col gap-1.5">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                  {tab === 'login' && errorMessage.includes('회원가입') && (
                    <button
                      type="button"
                      onClick={() => {
                        setTab('signup');
                        setErrorMessage(null);
                      }}
                      className="self-start mt-1 text-[11px] font-bold text-rose-600 underline hover:text-rose-800 flex items-center gap-1"
                    >
                      <UserPlus size={12} />
                      <span>지금 바로 회원가입하기 &rarr;</span>
                    </button>
                  )}
                </div>
              )}

              {/* 성공 메시지 */}
              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span className="font-semibold">{successMessage}</span>
                </div>
              )}

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">이메일 주소</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="catlover@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200/80 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">비밀번호</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6자 이상 입력"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200/80 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 제출 버튼 (Button-in-Button) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-500 ease-fluid active:scale-[0.98] mt-2"
                >
                  <span>{loading ? '처리 중...' : tab === 'login' ? '로그인하여 입장하기' : '회원가입 완료하기'}</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={16} />
                  </div>
                </button>
              </form>

              {/* 1초 체험 로그인 버튼 */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  disabled={loading}
                  className="w-full py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 border border-amber-200/60"
                >
                  <Sparkles size={13} className="text-amber-600" />
                  <span>체험용 계정으로 1초 만에 입장하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 푸터 */}
      <footer className="text-center text-[11px] text-stone-400 py-2 z-20">
        © 2026 Diamond Cat Studio • Protected by Supabase Auth
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
