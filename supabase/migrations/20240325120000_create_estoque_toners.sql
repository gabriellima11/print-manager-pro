CREATE TABLE public.estoque_toners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sede_id UUID NOT NULL REFERENCES public.sedes(id) ON DELETE CASCADE,
  modelo TEXT NOT NULL,
  cor TEXT NOT NULL CHECK (cor IN ('BLACK', 'CYAN', 'MAGENTA', 'YELLOW')),
  impressora_compativel TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.estoque_toners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow full access to authenticated users on estoque_toners" ON public.estoque_toners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated read estoque_toners" ON public.estoque_toners FOR SELECT TO authenticated USING (true);

-- Triggers
CREATE TRIGGER update_estoque_toners_updated_at BEFORE UPDATE ON public.estoque_toners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
