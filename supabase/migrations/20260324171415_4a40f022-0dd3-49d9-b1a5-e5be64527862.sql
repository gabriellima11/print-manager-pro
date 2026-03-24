
-- Tabela de Sedes
CREATE TABLE public.sedes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Agentes (um por sede, roda em Windows)
CREATE TABLE public.agentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sede_id UUID NOT NULL REFERENCES public.sedes(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  sistema_operacional TEXT NOT NULL DEFAULT 'Windows',
  ativo BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Impressoras
CREATE TABLE public.impressoras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ip TEXT NOT NULL,
  modelo TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('MONO', 'COLOR')),
  sede_id UUID NOT NULL REFERENCES public.sedes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  page_count INTEGER NOT NULL DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip, sede_id)
);

-- Tabela de Toners (nível atual por cor)
CREATE TABLE public.toners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  impressora_id UUID NOT NULL REFERENCES public.impressoras(id) ON DELETE CASCADE,
  cor TEXT NOT NULL CHECK (cor IN ('BLACK', 'CYAN', 'MAGENTA', 'YELLOW')),
  nivel_atual INTEGER NOT NULL DEFAULT 100 CHECK (nivel_atual >= 0 AND nivel_atual <= 100),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(impressora_id, cor)
);

-- Tabela de Leituras (histórico)
CREATE TABLE public.leituras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  impressora_id UUID NOT NULL REFERENCES public.impressoras(id) ON DELETE CASCADE,
  page_count INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Leituras de Toner (histórico)
CREATE TABLE public.leituras_toner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  impressora_id UUID NOT NULL REFERENCES public.impressoras(id) ON DELETE CASCADE,
  cor TEXT NOT NULL CHECK (cor IN ('BLACK', 'CYAN', 'MAGENTA', 'YELLOW')),
  nivel INTEGER NOT NULL CHECK (nivel >= 0 AND nivel <= 100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Eventos (alertas)
CREATE TABLE public.eventos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  impressora_id UUID NOT NULL REFERENCES public.impressoras(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('offline', 'toner_baixo', 'online')),
  descricao TEXT NOT NULL,
  cor TEXT,
  resolvido BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_leituras_impressora_ts ON public.leituras(impressora_id, timestamp DESC);
CREATE INDEX idx_leituras_toner_impressora_ts ON public.leituras_toner(impressora_id, timestamp DESC);
CREATE INDEX idx_eventos_impressora_ts ON public.eventos(impressora_id, timestamp DESC);
CREATE INDEX idx_eventos_tipo ON public.eventos(tipo);
CREATE INDEX idx_impressoras_sede ON public.impressoras(sede_id);
CREATE INDEX idx_impressoras_status ON public.impressoras(status);

-- RLS
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impressoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leituras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leituras_toner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Leitura para usuários autenticados
CREATE POLICY "Authenticated read sedes" ON public.sedes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read agentes" ON public.agentes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read impressoras" ON public.impressoras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read toners" ON public.toners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read leituras" ON public.leituras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read leituras_toner" ON public.leituras_toner FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read eventos" ON public.eventos FOR SELECT TO authenticated USING (true);

-- Função updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_impressoras_updated_at BEFORE UPDATE ON public.impressoras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_toners_updated_at BEFORE UPDATE ON public.toners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
