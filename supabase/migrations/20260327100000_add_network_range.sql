-- Adiciona a coluna network_range na tabela de sedes
ALTER TABLE public.sedes ADD COLUMN network_range TEXT;

-- Atualiza as sedes existentes com um valor padrão (pode ser ajustado manualmente depois)
UPDATE public.sedes SET network_range = '192.168.1' WHERE network_range IS NULL;
