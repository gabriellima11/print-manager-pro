-- Permitir exclusão de impressoras (RLS)
DROP POLICY IF EXISTS "Permitir delete em impressoras" ON impressoras;
CREATE POLICY "Permitir delete em impressoras" ON impressoras FOR DELETE TO authenticated USING (true);

-- Permitir exclusão de registros atrelados à impressora (toners, eventos, etc)
DROP POLICY IF EXISTS "Permitir delete em toners" ON toners;
CREATE POLICY "Permitir delete em toners" ON toners FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir delete em eventos" ON eventos;
CREATE POLICY "Permitir delete em eventos" ON eventos FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir delete em leituras_toner" ON leituras_toner;
CREATE POLICY "Permitir delete em leituras_toner" ON leituras_toner FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir delete em leituras" ON leituras;
CREATE POLICY "Permitir delete em leituras" ON leituras FOR DELETE TO authenticated USING (true);
