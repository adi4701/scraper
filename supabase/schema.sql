create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  tier text not null default 'hobby' check (tier in ('hobby', 'pro')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table if not exists idea_clusters (
  id text primary key,
  problem_category text not null,
  category text not null,
  urgency_score integer not null check (urgency_score between 1 and 10),
  competitor_mentioned text,
  summary_title text not null,
  summary text not null,
  raw_complaint text not null,
  source_url text,
  source text not null default 'public',
  author text not null default 'unknown',
  created_at timestamptz not null default now()
);

create table if not exists tracked_keywords (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  keyword text not null,
  created_at timestamptz not null default now(),
  unique (user_id, keyword)
);

alter table profiles enable row level security;
alter table idea_clusters enable row level security;
alter table tracked_keywords enable row level security;

drop policy if exists "Profiles are viewable by the owner" on profiles;
create policy "Profiles are viewable by the owner" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Ideas are viewable by authenticated users" on idea_clusters;
create policy "Ideas are viewable by authenticated users" on idea_clusters
  for select to authenticated using (true);

drop policy if exists "Tracked keywords are viewable by owner" on tracked_keywords;
create policy "Tracked keywords are viewable by owner" on tracked_keywords
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace view public.idea_clusters_hobby as
select
  id,
  problem_category,
  category,
  urgency_score,
  summary_title,
  summary,
  raw_complaint,
  source_url,
  source,
  author,
  created_at
from public.idea_clusters;
