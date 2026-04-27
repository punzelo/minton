create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  match_type text not null default 'doubles' check (match_type in ('singles', 'doubles')),
  bracket_type text not null default 'double_elimination' check (bracket_type in ('double_elimination')),
  status text not null default 'draft' check (status in ('draft', 'ready', 'ongoing', 'completed')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  player1_name text not null,
  player2_name text,
  seed integer,
  status text not null default 'active' check (status in ('active', 'eliminated')),
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  bracket text not null check (bracket in ('winners', 'losers', 'finals')),
  round integer not null,
  match_order integer not null,
  team_a_id uuid references public.teams(id) on delete set null,
  team_b_id uuid references public.teams(id) on delete set null,
  score_a integer,
  score_b integer,
  winner_team_id uuid references public.teams(id) on delete set null,
  loser_team_id uuid references public.teams(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'ready', 'completed')),
  next_match_id uuid references public.matches(id) on delete set null,
  next_match_slot text check (next_match_slot in ('A', 'B')),
  loser_next_match_id uuid references public.matches(id) on delete set null,
  loser_next_match_slot text check (loser_next_match_slot in ('A', 'B')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bracket_events (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  match_id uuid references public.matches(id) on delete set null,
  type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.bracket_events enable row level security;

create policy "Profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Public tournaments are readable" on public.tournaments
  for select using (is_public = true or owner_id = auth.uid());

create policy "Tournament owners can insert" on public.tournaments
  for insert with check (owner_id = auth.uid());

create policy "Tournament owners can update" on public.tournaments
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Teams are readable for public tournaments" on public.teams
  for select using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = teams.tournament_id
      and (tournaments.is_public = true or tournaments.owner_id = auth.uid())
    )
  );

create policy "Tournament owners can manage teams" on public.teams
  for all using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = teams.tournament_id
      and tournaments.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.tournaments
      where tournaments.id = teams.tournament_id
      and tournaments.owner_id = auth.uid()
    )
  );

create policy "Matches are readable for public tournaments" on public.matches
  for select using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = matches.tournament_id
      and (tournaments.is_public = true or tournaments.owner_id = auth.uid())
    )
  );

create policy "Tournament owners can manage matches" on public.matches
  for all using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = matches.tournament_id
      and tournaments.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.tournaments
      where tournaments.id = matches.tournament_id
      and tournaments.owner_id = auth.uid()
    )
  );

create policy "Events are readable for public tournaments" on public.bracket_events
  for select using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = bracket_events.tournament_id
      and (tournaments.is_public = true or tournaments.owner_id = auth.uid())
    )
  );
