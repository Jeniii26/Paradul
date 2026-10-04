-- ============================================================================
-- paradu'l — Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ============================================================================
-- Run this script inside the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- It creates the complete database structure, foreign keys, performance indexes,
-- and RLS policies ensuring each user only accesses their own wardrobe data.

-- 1. Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: clothing_items
-- Stores user wardrobe pieces with background-removed photo, price, color, and laundry status
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clothing_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    original_image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('Tops', 'Bottoms', 'Shoes')),
    color TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    style TEXT NOT NULL DEFAULT 'Casual',
    laundry_status TEXT NOT NULL DEFAULT 'available' CHECK (laundry_status IN ('available', 'in_laundry')),
    laundry_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for quick lookups by user and status
CREATE INDEX IF NOT EXISTS idx_clothing_user_id ON public.clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_category ON public.clothing_items(user_id, category);
CREATE INDEX IF NOT EXISTS idx_clothing_laundry ON public.clothing_items(user_id, laundry_status);

-- ============================================================================
-- TABLE: outfits
-- Combines Top, Bottom, and Shoes references into complete outfits
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    top_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    bottom_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    shoes_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    style TEXT NOT NULL DEFAULT 'Casual',
    color_theme TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id);

-- ============================================================================
-- TABLE: outfit_schedules
-- Calendar planner linking scheduled outfits to dates and occasions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.outfit_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    occasion TEXT NOT NULL DEFAULT 'Casual',
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'worn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedules_user_date ON public.outfit_schedules(user_id, date);

-- ============================================================================
-- TABLE: wear_records
-- Confirmed wear history driving wardrobe analytics & laundry triggers
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wear_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
    worn_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wear_records_user ON public.wear_records(user_id, outfit_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict data isolation: authenticated users can only view and mutate their own rows
-- ============================================================================

-- 1. clothing_items RLS
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own clothing items" ON public.clothing_items;
CREATE POLICY "Users can view own clothing items"
    ON public.clothing_items FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own clothing items" ON public.clothing_items;
CREATE POLICY "Users can insert own clothing items"
    ON public.clothing_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own clothing items" ON public.clothing_items;
CREATE POLICY "Users can update own clothing items"
    ON public.clothing_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own clothing items" ON public.clothing_items;
CREATE POLICY "Users can delete own clothing items"
    ON public.clothing_items FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. outfits RLS
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own outfits" ON public.outfits;
CREATE POLICY "Users can view own outfits"
    ON public.outfits FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own outfits" ON public.outfits;
CREATE POLICY "Users can insert own outfits"
    ON public.outfits FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own outfits" ON public.outfits;
CREATE POLICY "Users can update own outfits"
    ON public.outfits FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own outfits" ON public.outfits;
CREATE POLICY "Users can delete own outfits"
    ON public.outfits FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. outfit_schedules RLS
ALTER TABLE public.outfit_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own schedules" ON public.outfit_schedules;
CREATE POLICY "Users can view own schedules"
    ON public.outfit_schedules FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own schedules" ON public.outfit_schedules;
CREATE POLICY "Users can insert own schedules"
    ON public.outfit_schedules FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own schedules" ON public.outfit_schedules;
CREATE POLICY "Users can update own schedules"
    ON public.outfit_schedules FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own schedules" ON public.outfit_schedules;
CREATE POLICY "Users can delete own schedules"
    ON public.outfit_schedules FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. wear_records RLS
ALTER TABLE public.wear_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wear records" ON public.wear_records;
CREATE POLICY "Users can view own wear records"
    ON public.wear_records FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own wear records" ON public.wear_records;
CREATE POLICY "Users can insert own wear records"
    ON public.wear_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own wear records" ON public.wear_records;
CREATE POLICY "Users can delete own wear records"
    ON public.wear_records FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- SUPABASE STORAGE BUCKET: clothing-images
-- Optional: Creates public bucket for user clothing photos
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-images', 'clothing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access
DROP POLICY IF EXISTS "Public access to clothing images" ON storage.objects;
CREATE POLICY "Public access to clothing images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'clothing-images');

-- Storage RLS: Authenticated user upload access
DROP POLICY IF EXISTS "Authenticated users can upload clothing images" ON storage.objects;
CREATE POLICY "Authenticated users can upload clothing images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'clothing-images');
