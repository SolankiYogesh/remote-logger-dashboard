-- Create the packages table for authentication
create table public.packages (
  name text primary key,
  password text not null, -- Storing plain text for demo simplicity, hash in prod!
  created_at timestamptz default now()
);

-- Enable RLS on packages
alter table public.packages enable row level security;
-- Allow public insert (registration) - in prod you might restrict this
create policy "Allow public insert packages" on public.packages for insert with check (true);
-- Allow public select for auth check
create policy "Allow public select packages" on public.packages for select using (true);

-- Create the logs table (updated to reference packages if desired, but keeping loose for now)
create table if not exists public.logs (
  id uuid default gen_random_uuid() primary key,
  package_name text not null, -- Could be references public.packages(name)
  level text not null,
  message text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Index for faster filtering by package
create index if not exists idx_logs_package_name on public.logs(package_name);

-- Enable RLS
alter table public.logs enable row level security;

-- Policies
create policy "Allow public insert" on public.logs for insert with check (true);
create policy "Allow public select" on public.logs for select using (true);
create policy "Allow public delete" on public.logs for delete using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.logs;
