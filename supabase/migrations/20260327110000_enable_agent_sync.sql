-- Migration to allow anonymous writes (for the agent)

-- Políticas para Impressoras
CREATE POLICY "Enable insert for anon" ON public.impressoras FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for anon" ON public.impressoras FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Políticas para Toners
CREATE POLICY "Enable insert for anon toners" ON public.toners FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable update for anon toners" ON public.toners FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Políticas para Leituras
CREATE POLICY "Enable insert for anon leituras" ON public.leituras FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable insert for anon leituras_toner" ON public.leituras_toner FOR INSERT TO anon WITH CHECK (true);
