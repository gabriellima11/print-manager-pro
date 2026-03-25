
-- Allow anon (unauthenticated) reads on all monitoring tables
CREATE POLICY "Anon read sedes" ON public.sedes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read impressoras" ON public.impressoras FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read toners" ON public.toners FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read eventos" ON public.eventos FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read leituras" ON public.leituras FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read leituras_toner" ON public.leituras_toner FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read agentes" ON public.agentes FOR SELECT TO anon USING (true);
