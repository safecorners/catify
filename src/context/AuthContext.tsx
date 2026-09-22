'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; hasSession?: boolean }>;
  quickDemoLogin: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Supabase 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: 'Supabase가 아직 연결되지 않았습니다.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: 'Supabase가 아직 연결되지 않았습니다.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
        return { error: null, hasSession: true };
      }
      return { error: null, hasSession: false };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.' };
    }
  };

  // 체험용 1초 간편 로그인
  const quickDemoLogin = async () => {
    const demoEmail = 'cat_player@demo.com';
    const demoPass = 'catpass123!';

    const { error: signInError } = await signIn(demoEmail, demoPass);
    if (!signInError) return { error: null };

    // 가입 안 되어있으면 즉시 가입
    const { error: signUpError } = await signUp(demoEmail, demoPass);
    if (signUpError) return { error: signUpError };

    return await signIn(demoEmail, demoPass);
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsGuest(true);
  };

  const enterGuestMode = () => {
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        isGuest,
        signIn,
        signUp,
        quickDemoLogin,
        signOut,
        enterGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
