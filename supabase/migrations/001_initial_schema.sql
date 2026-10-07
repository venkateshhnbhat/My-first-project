-- ==============================================================================
-- Schema: AI-Powered Dynamic Mental Health Monitoring & Distress Prediction
-- Description: Production PostgreSQL schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_range text,
  preferred_language text default 'en',
  timezone text default 'UTC',
  notification_enabled boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 4. CONSENT RECORDS TABLE
create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_version text not null,
  consented boolean not null,
  consented_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now()
);

-- 5. CHECK-INS TABLE
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  mood smallint not null,
  stress smallint not null,
  anxiety smallint not null,
  sleep_quality smallint not null,
  energy smallint not null,
  social_connection smallint not null,
  daily_functioning smallint not null,

  journal_text text,
  check_in_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint check_mood_range check (mood between 1 and 10),
  constraint check_stress_range check (stress between 1 and 10),
  constraint check_anxiety_range check (anxiety between 1 and 10),
  constraint check_sleep_range check (sleep_quality between 1 and 10),
  constraint check_energy_range check (energy between 1 and 10),
  constraint check_social_range check (social_connection between 1 and 10),
  constraint check_functioning_range check (daily_functioning between 1 and 10)
);

create trigger tr_check_ins_updated_at
before update on public.check_ins
for each row execute function public.set_updated_at();

-- 6. ASSESSMENTS TABLE
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_id uuid references public.check_ins(id) on delete set null,

  risk_level text not null,
  trend_direction text not null,

  distress_score numeric(5,2),
  confidence_score numeric(5,2),

  summary text,
  contributing_factors jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,

  professional_support_recommended boolean not null default false,
  urgent_support_recommended boolean not null default false,

  model_name text,
  model_version text,

  created_at timestamptz not null default now(),

  constraint valid_risk_level
    check (risk_level in ('LOW', 'MODERATE', 'HIGH', 'URGENT_SUPPORT')),

  constraint valid_trend_direction
    check (trend_direction in ('IMPROVING', 'STABLE', 'INCREASING', 'VOLATILE', 'INSUFFICIENT_DATA'))
);

-- 7. JOURNAL ANALYSES TABLE
create table if not exists public.journal_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_id uuid references public.check_ins(id) on delete cascade,

  emotions jsonb not null default '[]'::jsonb,
  themes jsonb not null default '[]'::jsonb,
  sentiment text,
  distress_signals jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now()
);

-- 8. SUPPORT RESOURCES TABLE
create table if not exists public.support_resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  resource_type text not null,
  country_code text,
  phone text,
  website text,
  available_hours text,
  is_emergency boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. AUDIT EVENTS TABLE
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 10. INDEXES
create index if not exists idx_check_ins_user_date on public.check_ins(user_id, check_in_date desc);
create index if not exists idx_assessments_user_created on public.assessments(user_id, created_at desc);
create index if not exists idx_journal_analyses_user on public.journal_analyses(user_id, created_at desc);
create index if not exists idx_support_resources_country on public.support_resources(country_code, is_emergency);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.consent_records enable row level security;
alter table public.check_ins enable row level security;
alter table public.assessments enable row level security;
alter table public.journal_analyses enable row level security;
alter table public.audit_events enable row level security;
alter table public.support_resources enable row level security;

-- Profiles: users read and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Consent Records
create policy "Users can view own consent" on public.consent_records
  for select using (auth.uid() = user_id);

create policy "Users can insert own consent" on public.consent_records
  for insert with check (auth.uid() = user_id);

-- Check-ins
create policy "Users can view own check-ins" on public.check_ins
  for select using (auth.uid() = user_id);

create policy "Users can insert own check-ins" on public.check_ins
  for insert with check (auth.uid() = user_id);

create policy "Users can update own check-ins" on public.check_ins
  for update using (auth.uid() = user_id);

create policy "Users can delete own check-ins" on public.check_ins
  for delete using (auth.uid() = user_id);

-- Assessments
create policy "Users can view own assessments" on public.assessments
  for select using (auth.uid() = user_id);

create policy "Users can delete own assessments" on public.assessments
  for delete using (auth.uid() = user_id);

-- Journal Analyses
create policy "Users can view own journal analyses" on public.journal_analyses
  for select using (auth.uid() = user_id);

create policy "Users can delete own journal analyses" on public.journal_analyses
  for delete using (auth.uid() = user_id);

-- Support Resources (Publicly readable verified crisis lines)
create policy "Support resources are publicly viewable" on public.support_resources
  for select using (is_active = true);

-- Audit Events
create policy "Users can view own audit records" on public.audit_events
  for select using (auth.uid() = user_id);

-- 12. INITIAL SEED DATA FOR SUPPORT RESOURCES
insert into public.support_resources (name, description, resource_type, country_code, phone, website, available_hours, is_emergency)
values
  ('988 Suicide & Crisis Lifeline', 'Free, confidential 24/7 support across the US and Canada.', 'crisis_hotline', 'US', '988', 'https://988lifeline.org', '24/7 / 365 Days', true),
  ('Crisis Text Line', 'Free 24/7 text support with trained crisis counselors.', 'text_line', 'GLOBAL', 'Text HOME to 741741', 'https://www.crisistextline.org', '24/7', true),
  ('The Trevor Project', 'Confidential suicide prevention for LGBTQ youth.', 'crisis_hotline', 'US', '1-866-488-7386', 'https://www.thetrevorproject.org', '24/7', true),
  ('Samaritans', 'Listening service for anyone struggling to cope.', 'crisis_hotline', 'GB', '116 123', 'https://www.samaritans.org', '24/7', true),
  ('Befrienders Worldwide', 'Global network of crisis lines in 32 countries.', 'organization', 'GLOBAL', null, 'https://www.befrienders.org', 'Online Directory', false);
