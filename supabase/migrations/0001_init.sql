-- Amazing World Travel: initial schema, row-level security and media storage.
-- Public visitors can read published catalogue rows and media only. Bookings, enquiries and
-- chat transcripts are written by server route handlers (service role) and read by staff.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Staff allow-list (linked to Supabase Auth users)
-- ---------------------------------------------------------------------------
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
create table public.destinations (
  id text primary key,
  name text not null,
  region text not null,
  tagline text not null default '',
  description text not null default '',
  recommended_nights int not null default 2,
  banner_image text not null default '',
  thumbnail text not null default '',
  video text,
  highlights text[] not null default '{}',
  lat double precision,
  lng double precision,
  travel_tips text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.hotels (
  id text primary key,
  name text not null,
  destination_id text not null references public.destinations (id) on delete cascade on update cascade,
  tier text not null check (tier in ('comfort', 'superior', 'luxury')),
  category text not null default '',
  stars int not null default 4 check (stars between 1 and 5),
  price_per_night_usd int not null check (price_per_night_usd >= 0),
  image text not null default '',
  amenities text[] not null default '{}',
  room_type text not null default '',
  distance_to_highlight text not null default '',
  description text not null default '',
  badge text,
  sort_order int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
create index hotels_destination_idx on public.hotels (destination_id);

create table public.tours (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  tagline text not null default '',
  summary text not null default '',
  kind text not null default 'tour' check (kind in ('tour', 'day')),
  duration_days int not null check (duration_days between 1 and 30),
  themes text[] not null default '{}',
  route text[] not null default '{}',
  destination_ids text[] not null default '{}',
  best_season text not null default '',
  season_months int[] not null default '{1,2,3,4,5,6,7,8,9,10,11,12}',
  price_comfort_usd int not null check (price_comfort_usd >= 0),
  price_superior_usd int not null check (price_superior_usd >= 0),
  price_luxury_usd int not null check (price_luxury_usd >= 0),
  highlights text[] not null default '{}',
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  hero_image text not null default '',
  gallery text[] not null default '{}',
  video text,
  badge text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.tour_days (
  id uuid primary key default gen_random_uuid(),
  tour_slug text not null references public.tours (slug) on delete cascade on update cascade,
  day int not null check (day >= 1),
  title text not null,
  destination_id text references public.destinations (id) on update cascade on delete set null,
  description text not null default '',
  drive_time text,
  overnight text not null default '',
  meals text not null default '',
  unique (tour_slug, day)
);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  tour_slug text references public.tours (slug) on delete cascade on update cascade,
  starts_on date not null,
  ends_on date not null,
  reason text not null default '',
  check (ends_on >= starts_on)
);

-- ---------------------------------------------------------------------------
-- Media library and site settings
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video')),
  storage_path text,
  url text not null,
  alt text not null default '',
  tags text[] not null default '{}',
  bytes bigint,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.fx_rates (
  currency text primary key check (currency ~ '^[A-Z]{3}$'),
  rate numeric(14, 6) not null check (rate > 0),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Bookings, enquiries, AI planner transcripts
-- ---------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind text not null check (kind in ('tour', 'custom', 'planner')),
  tour_slug text references public.tours (slug) on update cascade on delete set null,
  tour_title text not null,
  start_date date,
  adults int not null check (adults between 1 and 30),
  children int not null default 0 check (children between 0 and 30),
  tier text check (tier in ('comfort', 'superior', 'luxury')),
  itinerary jsonb,
  price_total_usd numeric(10, 2) not null check (price_total_usd >= 0),
  deposit_usd numeric(10, 2) not null check (deposit_usd >= 0),
  status text not null default 'requested'
    check (status in ('requested', 'confirmed', 'deposit_paid', 'paid', 'completed', 'cancelled')),
  lead_name text not null,
  email text not null,
  phone text not null,
  country text not null default '',
  notes text not null default '',
  admin_notes text not null default '',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_status_idx on public.bookings (status, created_at desc);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null default '',
  source text not null default 'contact',
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  message_count int not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  booking_reference text,
  created_at timestamptz not null default now(),
  last_at timestamptz not null default now()
);
create index chat_sessions_ip_idx on public.chat_sessions (ip_hash, created_at desc);

create table public.chat_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content jsonb not null,
  created_at timestamptz not null default now()
);
create index chat_messages_session_idx on public.chat_messages (session_id, id);

-- Planner spend controls (called by the server with the service role only).
-- reserve_chat_turn counts a turn *before* the model is called, under a per-visitor lock, so
-- parallel requests can't slip past the daily cap. It returns false when the cap is reached or the
-- session doesn't belong to this visitor.
create or replace function public.reserve_chat_turn(p_session uuid, p_ip_hash text, p_daily_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  used int;
begin
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  select coalesce(sum(message_count), 0) into used
    from public.chat_sessions
   where ip_hash = p_ip_hash and last_at > now() - interval '24 hours';
  if used >= p_daily_limit then
    return false;
  end if;
  update public.chat_sessions
     set message_count = message_count + 1, last_at = now()
   where id = p_session and ip_hash = p_ip_hash;
  return found;
end;
$$;

-- Adds a finished turn's token usage.
create or replace function public.record_chat_tokens(p_session uuid, p_input bigint, p_output bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.chat_sessions
     set input_tokens = input_tokens + coalesce(p_input, 0),
         output_tokens = output_tokens + coalesce(p_output, 0),
         last_at = now()
   where id = p_session;
$$;

-- Total planner tokens across all visitors in the last 24 hours (global circuit breaker).
create or replace function public.planner_tokens_last_day()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(input_tokens + output_tokens), 0)::bigint
    from public.chat_sessions
   where last_at > now() - interval '24 hours';
$$;

revoke all on function public.reserve_chat_turn(uuid, text, int) from public, anon, authenticated;
revoke all on function public.record_chat_tokens(uuid, bigint, bigint) from public, anon, authenticated;
revoke all on function public.planner_tokens_last_day() from public, anon, authenticated;
grant execute on function public.reserve_chat_turn(uuid, text, int) to service_role;
grant execute on function public.record_chat_tokens(uuid, bigint, bigint) to service_role;
grant execute on function public.planner_tokens_last_day() to service_role;

-- updated_at triggers
create trigger destinations_touch before update on public.destinations for each row execute function public.touch_updated_at();
create trigger hotels_touch before update on public.hotels for each row execute function public.touch_updated_at();
create trigger tours_touch before update on public.tours for each row execute function public.touch_updated_at();
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();
create trigger site_settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.staff enable row level security;
alter table public.destinations enable row level security;
alter table public.hotels enable row level security;
alter table public.tours enable row level security;
alter table public.tour_days enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.fx_rates enable row level security;
alter table public.bookings enable row level security;
alter table public.enquiries enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Staff: a signed-in staff member can see the allow-list; changes are made by the owner in SQL.
create policy staff_read on public.staff for select to authenticated using (public.is_staff());

-- Catalogue: public reads published rows; staff manage everything.
create policy destinations_public_read on public.destinations for select to anon, authenticated using (published or public.is_staff());
create policy destinations_staff_write on public.destinations for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy hotels_public_read on public.hotels for select to anon, authenticated using (published or public.is_staff());
create policy hotels_staff_write on public.hotels for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy tours_public_read on public.tours for select to anon, authenticated using (published or public.is_staff());
create policy tours_staff_write on public.tours for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy tour_days_public_read on public.tour_days for select to anon, authenticated
  using (exists (select 1 from public.tours t where t.slug = tour_slug and (t.published or public.is_staff())));
create policy tour_days_staff_write on public.tour_days for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy availability_public_read on public.availability_blocks for select to anon, authenticated using (true);
-- Visitors see blocked dates only, never the internal reason notes.
revoke select on public.availability_blocks from anon;
grant select (id, tour_slug, starts_on, ends_on) on public.availability_blocks to anon;
create policy availability_staff_write on public.availability_blocks for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy media_public_read on public.media_assets for select to anon, authenticated using (true);
-- Don't expose which staff account uploaded each file.
revoke select on public.media_assets from anon;
grant select (id, kind, url, alt, tags, created_at) on public.media_assets to anon;
create policy media_staff_write on public.media_assets for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy settings_public_read on public.site_settings for select to anon, authenticated using (true);
create policy settings_staff_write on public.site_settings for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy fx_public_read on public.fx_rates for select to anon, authenticated using (true);

-- Private records: staff only (inserts come from server route handlers using the service role).
create policy bookings_staff_read on public.bookings for select to authenticated using (public.is_staff());
create policy bookings_staff_update on public.bookings for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy enquiries_staff_read on public.enquiries for select to authenticated using (public.is_staff());
create policy enquiries_staff_update on public.enquiries for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy chat_sessions_staff_read on public.chat_sessions for select to authenticated using (public.is_staff());
create policy chat_messages_staff_read on public.chat_messages for select to authenticated using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Storage: public-read media bucket, staff-only writes (50 MB per file)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

create policy media_bucket_staff_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());
create policy media_bucket_staff_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
create policy media_bucket_staff_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());
