-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates the products table and storage bucket

-- 1. Create products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null default '',
  category text not null default 'kurti',
  fabric text not null default '',
  work_type text not null default '',
  price integer not null default 0,
  images jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table products enable row level security;

-- 3. Public can read published products
create policy "Public can read published products"
  on products for select
  using (is_published = true);

-- 4. Service role can do everything (used by API routes)
-- (Service role bypasses RLS by default, so no extra policy needed)

-- 5. Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 6. Allow public to read images
create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 7. Allow service role to upload images
-- (Service role bypasses storage policies by default)
