create extension if not exists "pg_trgm";

alter table public.sermons
add column if not exists preacher_name text not null default '';

create index if not exists sermons_preacher_name_idx
on public.sermons using gin (preacher_name gin_trgm_ops);
