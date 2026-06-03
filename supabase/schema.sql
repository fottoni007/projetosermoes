create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preacher_name text not null default '',
  date date not null,
  biblical_text text not null,
  series_theme text not null,
  notes text not null,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id)
);

create index if not exists sermons_date_idx on public.sermons(date desc);
create index if not exists sermons_title_idx on public.sermons using gin (title gin_trgm_ops);
create index if not exists sermons_preacher_name_idx on public.sermons using gin (preacher_name gin_trgm_ops);
create index if not exists sermons_biblical_text_idx on public.sermons using gin (biblical_text gin_trgm_ops);
create index if not exists sermons_series_theme_idx on public.sermons using gin (series_theme gin_trgm_ops);
create index if not exists sermons_notes_idx on public.sermons using gin (notes gin_trgm_ops);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sermons_set_updated_at on public.sermons;
create trigger sermons_set_updated_at
before update on public.sermons
for each row execute function public.set_updated_at();

alter table public.sermons enable row level security;

drop policy if exists "Authenticated users can read sermons" on public.sermons;
create policy "Authenticated users can read sermons"
on public.sermons for select
to authenticated
using (true);

drop policy if exists "Authenticated users can create sermons" on public.sermons;
create policy "Authenticated users can create sermons"
on public.sermons for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "Authenticated users can update sermons" on public.sermons;
create policy "Authenticated users can update sermons"
on public.sermons for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('sermon-pdfs', 'sermon-pdfs', false)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can read sermon PDFs" on storage.objects;
create policy "Authenticated users can read sermon PDFs"
on storage.objects for select
to authenticated
using (bucket_id = 'sermon-pdfs');

drop policy if exists "Authenticated users can upload sermon PDFs" on storage.objects;
create policy "Authenticated users can upload sermon PDFs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'sermon-pdfs');

drop policy if exists "Authenticated users can update sermon PDFs" on storage.objects;
create policy "Authenticated users can update sermon PDFs"
on storage.objects for update
to authenticated
using (bucket_id = 'sermon-pdfs')
with check (bucket_id = 'sermon-pdfs');
