-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Auto-update updated_at function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- Areas of Focus
create table public.areas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.areas enable row level security;

create policy "Users can CRUD own areas" on public.areas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tags (contexts)
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.tags enable row level security;

create policy "Users can CRUD own tags" on public.tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Projects
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text default '',
  state text not null default 'active' check (state in ('active', 'someday', 'scheduled', 'completed')),
  type text not null default 'parallel' check (type in ('sequential', 'parallel')),
  area_id uuid references public.areas(id) on delete set null,
  is_focused boolean default false,
  scheduled_date date,
  due_date date,
  completed_at timestamptz,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger projects_updated_at before update on public.projects
  for each row execute function public.update_updated_at_column();

-- Items (actions/tasks)
create table public.items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text default '',
  state text not null default 'inbox' check (state in ('inbox', 'next', 'scheduled', 'someday', 'waiting', 'completed', 'trash')),
  project_id uuid references public.projects(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  is_focused boolean default false,
  scheduled_date date,
  due_date date,
  time_estimate integer check (time_estimate is null or time_estimate in (5, 15, 30, 60, 120, 240)),
  sort_order integer default 0,
  sort_order_project integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.items enable row level security;

create policy "Users can CRUD own items" on public.items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger items_updated_at before update on public.items
  for each row execute function public.update_updated_at_column();

-- Item-Tag relationship
create table public.item_tags (
  item_id uuid references public.items(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (item_id, tag_id)
);

alter table public.item_tags enable row level security;

create policy "Users can CRUD own item_tags" on public.item_tags
  for all using (
    exists (select 1 from public.items where items.id = item_tags.item_id and items.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.items where items.id = item_tags.item_id and items.user_id = auth.uid())
  );

-- Performance indexes
create index idx_items_user_state on public.items(user_id, state);
create index idx_items_user_project on public.items(user_id, project_id);
create index idx_items_user_area on public.items(user_id, area_id);
create index idx_items_scheduled on public.items(user_id, scheduled_date) where scheduled_date is not null;
create index idx_items_due on public.items(user_id, due_date) where due_date is not null;
create index idx_items_focused on public.items(user_id, is_focused) where is_focused = true;
create index idx_projects_user_state on public.projects(user_id, state);