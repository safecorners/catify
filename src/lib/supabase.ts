import { createClient } from '@supabase/supabase-js';

// 환경 변수 우선, 미적용 시(dev 서버 재시작 전) 기본 프로젝트 설정 사용
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://izaspwahkchysyhaidpi.supabase.co';

const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6YXNwd2Foa2NoeXN5aGFpZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNTgyODQsImV4cCI6MjEwNTYzNDI4NH0.qYSSRGe43nCX25WHmdIscWnUTjFnptfm5_YOJtniqk8';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    supabaseKey !== 'your-anon-key-here'
  );
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
