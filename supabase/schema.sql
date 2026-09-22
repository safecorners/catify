-- ==========================================
-- 고양이 키우기 앱 (Cat Raising App) Supabase Schema
-- ==========================================

-- 1. 고양이 데이터 테이블 생성
create table if not exists public.cats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null default '다이아냥',
  hunger integer not null default 70 check (hunger >= 0 and hunger <= 100),
  happiness integer not null default 80 check (happiness >= 0 and happiness <= 100),
  affection integer not null default 50 check (affection >= 0 and affection <= 100),
  level integer not null default 1 check (level >= 1),
  color text not null default 'orange',
  pattern text not null default 'stripes',
  accessories jsonb not null default '{"ears": "none", "neck": "bell", "hat": "none", "glasses": "none"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS (Row Level Security) 활성화
alter table public.cats enable row level security;

-- 3. RLS 정책 설정 (본인 고양이만 조회, 생성, 수정 가능)
drop policy if exists "Users can view their own cat" on public.cats;
create policy "Users can view their own cat" 
  on public.cats for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own cat" on public.cats;
create policy "Users can insert their own cat" 
  on public.cats for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own cat" on public.cats;
create policy "Users can update their own cat" 
  on public.cats for update 
  using (auth.uid() = user_id);

-- 4. updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.cats;
create trigger set_updated_at
  before update on public.cats
  for each row
  execute function public.handle_updated_at();
