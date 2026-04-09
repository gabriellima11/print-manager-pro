-- Migration: Add patrimonio column to impressoras table

-- 1. Add the column as optional (nullable)
ALTER TABLE public.impressoras ADD COLUMN patrimonio TEXT;

-- 2. Update existing policies for authenticated users if they are missing
-- Based on previous migrations, we should ensure 'authenticated' has full access if we're adding manual management.
-- We already have SELECT, let's ensure INSERT/UPDATE/DELETE.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated insert impressoras' AND tablename = 'impressoras') THEN
        CREATE POLICY "Allow authenticated insert impressoras" ON public.impressoras FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated update impressoras' AND tablename = 'impressoras') THEN
        CREATE POLICY "Allow authenticated update impressoras" ON public.impressoras FOR UPDATE TO authenticated USING (true);
    END IF;
END $$;
