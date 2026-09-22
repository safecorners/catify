'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Cloud, LogOut, Mail, Lock, AlertCircle, CheckCircle2, Sparkles, UserPlus } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, isConfigured, signIn, signUp, quickDemoLogin, signOut } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
        setSuccessMessage('로그인되었습니다!');
        setTimeout(() => onClose(), 800);
      }
    } else {
      const { error, hasSession } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage(translateError(error));
      } else {
        if (hasSession) {
          setSuccessMessage('회원가입 및 로그인이 완료되었습니다!');
          setTimeout(() => onClose(), 800);
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
      setSuccessMessage('체험 계정으로 로그인되었습니다!');
      setTimeout(() => onClose(), 800);
    }
  };

  const handleSignOut = async () => {
    soundEngine.playClick();
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-amber-100">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Cloud size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">클라우드 계정 연동</h3>
            <p className="text-xs text-slate-500">Supabase로 고양이 데이터를 안전하게 동기화</p>
          </div>
        </div>

        {user ? (
          // 로그인된 상태
          <div className="space-y-4 py-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500">현재 접속 계정</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5 break-all">{user.email}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-2 font-medium">
                <CheckCircle2 size={13} />
                <span>고양이 데이터가 Supabase DB에 실시간 동기화 중입니다.</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        ) : (
          // 로그인/회원가입 폼
          <div>
            {/* 탭 전환 버튼 */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setErrorMessage(null);
                  setTab('login');
                }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  tab === 'login' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
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
                className={`flex-1 py-2 rounded-xl transition-all ${
                  tab === 'signup' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                회원가입
              </button>
            </div>

            {/* 에러 메시지 */}
            {errorMessage && (
              <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex flex-col gap-1.5">
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
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-1.5">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">이메일</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">비밀번호</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상 입력"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>처리 중...</span>
                ) : tab === 'login' ? (
                  <span>로그인하기</span>
                ) : (
                  <span>회원가입하기</span>
                )}
              </button>
            </form>

            {/* 간편 1초 체험 로그인 버튼 */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={loading}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>체험용 계정으로 1초 만에 로그인하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
