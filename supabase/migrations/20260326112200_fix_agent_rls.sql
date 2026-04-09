-- Permissões para que o agente (anon) possa inserir e atualizar impressoras
CREATE POLICY "Allow anon insert impressoras" ON public.impressoras FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update impressoras" ON public.impressoras FOR UPDATE USING (true);

-- Permissões para outras tabelas que o agente possa precisar (ex: leituras, toners)
CREATE POLICY "Allow anon insert leituras" ON public.leituras FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert toners" ON public.toners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update toners" ON public.toners FOR UPDATE USING (true);
