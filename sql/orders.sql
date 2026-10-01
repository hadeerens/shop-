create table orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null, phone text not null, address text not null,
  payment text not null, items jsonb not null,
  subtotal numeric not null, shipping numeric not null, total numeric not null,
  status text not null default 'new'
);
-- RLS on with no policies: only the server (service role key) can read/write.
alter table orders enable row level security;
