-- Supabase SQL Editor에서 실행하세요

create table design_forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  user_email text,
  status text default 'draft' check (status in ('draft', 'submitted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- 과제 기본 정보
  iris_number text default '',
  project_name text default '',
  main_org text default '',
  co_org text default '',

  -- 설계서 내용 (JSON으로 저장)
  form_data jsonb default '{}'::jsonb
);

-- 본인 데이터만 접근 가능하도록 RLS 설정
alter table design_forms enable row level security;

create policy "users can view own forms"
  on design_forms for select
  using (auth.uid() = user_id);

create policy "users can insert own forms"
  on design_forms for insert
  with check (auth.uid() = user_id);

create policy "users can update own forms"
  on design_forms for update
  using (auth.uid() = user_id);

-- 관리자용: service_role로 전체 조회 가능 (별도 정책 불필요)

-- updated_at 자동 갱신
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger design_forms_updated_at
  before update on design_forms
  for each row execute function update_updated_at();

-- =============================================
-- 피드백 시스템 테이블
-- =============================================

-- 상시 피드백 (로그인 불필요)
create table feedback (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('system_error','inconvenience','feature_request','other')),
  content text not null,
  email text,
  user_id uuid references auth.users(id) on delete set null,
  status text default 'new' check (status in ('new','reviewing','resolved')),
  admin_note text,
  created_at timestamptz default now()
);

-- 자문 직후 평가
create table consultation_ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  project_name text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  aspects jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 정기 만족도 조사 (관리자가 활성화)
create table surveys (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  period text not null,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table survey_responses (
  id uuid default gen_random_uuid() primary key,
  survey_id uuid references surveys(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(survey_id, user_id)
);

-- 관리자 역할 테이블
create table admin_users (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  added_at timestamptz default now()
);

-- RLS 설정
alter table feedback enable row level security;
alter table consultation_ratings enable row level security;
alter table survey_responses enable row level security;
alter table admin_users enable row level security;
alter table surveys enable row level security;

-- feedback: 누구나 insert 가능, 본인 것만 select
create policy "anyone can submit feedback"
  on feedback for insert with check (true);
create policy "users can view own feedback"
  on feedback for select using (auth.uid() = user_id or email = (select email from auth.users where id = auth.uid()));

-- consultation_ratings: 로그인 사용자만
create policy "logged in users can rate"
  on consultation_ratings for insert with check (auth.uid() = user_id);
create policy "users can view own ratings"
  on consultation_ratings for select using (auth.uid() = user_id);

-- surveys: 누구나 조회
create policy "anyone can view active surveys"
  on surveys for select using (is_active = true);

-- survey_responses: 로그인 사용자, 본인 것만
create policy "users can submit survey"
  on survey_responses for insert with check (auth.uid() = user_id);
create policy "users can view own responses"
  on survey_responses for select using (auth.uid() = user_id);

-- admin_users: service_role만 관리
create policy "admins can view admin list"
  on admin_users for select using (auth.uid() = user_id);

-- 관리자 등록 방법 (SQL Editor에서 직접 실행):
-- insert into admin_users (user_id, email) values ('관리자_UUID', 'admin@example.com');

-- =============================================
-- 자문위원/과제팀 설문 확장 (target 컬럼 추가)
-- =============================================

alter table surveys add column if not exists target text default 'general' check (target in ('general','advisor','team'));

-- 기존 활성 설문이 general이었다면 영향 없음. 신규 생성 시 target 지정.
