-- Enable Row Level Security
ALTER TABLE agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE impressoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE leituras ENABLE ROW LEVEL SECURITY;
ALTER TABLE leituras_toner ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE toners ENABLE ROW LEVEL SECURITY;

-- Create policies to allow full access to authenticated users
CREATE POLICY "Allow full access to authenticated users on agentes" ON agentes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on eventos" ON eventos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on impressoras" ON impressoras FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on leituras" ON leituras FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on leituras_toner" ON leituras_toner FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on sedes" ON sedes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on toners" ON toners FOR ALL TO authenticated USING (true) WITH CHECK (true);
