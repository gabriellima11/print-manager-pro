import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Toner {
  cor: string;
  nivel_atual: number;
}

export interface PrinterWithToners {
  id: string;
  nome: string;
  ip: string;
  mac_address: string | null;
  modelo: string | null;
  tipo: string;
  sede_id: string;
  status: string;
  page_count: number;
  last_seen: string | null;
  toners: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
  };
}

export interface Sede {
  id: string;
  nome: string;
}

export interface Evento {
  id: string;
  impressora_id: string;
  tipo: string;
  descricao: string;
  timestamp: string;
  cor: string | null;
  resolvido: boolean;
}

function buildTonersMap(toners: Toner[]): PrinterWithToners["toners"] {
  const map: PrinterWithToners["toners"] = { black: 0 };
  for (const t of toners) {
    const key = t.cor.toLowerCase();
    if (key === "black") map.black = t.nivel_atual;
    else if (key === "cyan") map.cyan = t.nivel_atual;
    else if (key === "magenta") map.magenta = t.nivel_atual;
    else if (key === "yellow") map.yellow = t.nivel_atual;
  }
  return map;
}

export function useSedes() {
  return useQuery({
    queryKey: ["sedes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sedes").select("*").order("nome");
      if (error) throw error;
      return data as Sede[];
    },
  });
}

export function usePrinters() {
  return useQuery({
    queryKey: ["printers"],
    queryFn: async () => {
      const { data: impressoras, error: pErr } = await supabase
        .from("impressoras")
        .select("*");
      if (pErr) throw pErr;

      const { data: toners, error: tErr } = await supabase
        .from("toners")
        .select("*");
      if (tErr) throw tErr;

      return (impressoras ?? []).map((p): PrinterWithToners => {
        const printerToners = (toners ?? []).filter((t) => t.impressora_id === p.id);
        return {
          ...p,
          toners: buildTonersMap(printerToners),
        };
      });
    },
  });
}

export function useUpdatePrinter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; nome: string; ip: string; sede_id: string; page_count: number; mac_address: string | null; tipo: string; modelo: string | null }) => {
      const { id, ...data } = updates;
      
      const { data: updatedRows, error } = await supabase
        .from("impressoras")
        .update(data)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      
      if (!updatedRows || updatedRows.length === 0) {
         throw new Error("A atualização foi bloqueada pelo banco de dados. Isso geralmente significa que faltam as Políticas de RLS de UPDATE para a tabela.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });
}

export function useDeletePrinter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Deletar registros relacionados primeiro para evitar erro de Foreign Key (caso o CASCADE não esteja ativo)
      await supabase.from("toners").delete().eq("impressora_id", id);
      await supabase.from("eventos").delete().eq("impressora_id", id);
      await supabase.from("leituras_toner").delete().eq("impressora_id", id);
      await supabase.from("leituras").delete().eq("impressora_id", id);

      const { data, error } = await supabase
        .from("impressoras")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
         throw new Error("A exclusão foi bloqueada pelo banco de dados (RLS) ou a impressora não existe.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });
}

export function useEventos(limit?: number) {
  return useQuery({
    queryKey: ["eventos", limit],
    queryFn: async () => {
      let query = supabase
        .from("eventos")
        .select("*")
        .eq("resolvido", false)
        .order("timestamp", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as Evento[];
    },
  });
}

export function useUsageBySede() {
  return useQuery({
    queryKey: ["usage-by-sede"],
    queryFn: async () => {
      const { data: sedes, error: sErr } = await supabase.from("sedes").select("*");
      if (sErr) throw sErr;
      const { data: impressoras, error: pErr } = await supabase.from("impressoras").select("id, sede_id, page_count");
      if (pErr) throw pErr;

      return (sedes ?? []).map((s) => {
        const pages = (impressoras ?? [])
          .filter((p) => p.sede_id === s.id)
          .reduce((sum, p) => sum + p.page_count, 0);
        const shortName = s.nome.length > 14 ? s.nome.substring(0, 12) + "..." : s.nome;
        return { sede: shortName, pages };
      });
    },
  });
}

export function getSedeNome(sedes: Sede[], sedeId: string): string {
  return sedes.find((s) => s.id === sedeId)?.nome ?? "Desconhecida";
}

export function getCriticalToners(printer: PrinterWithToners): { cor: string; nivel: number }[] {
  const critical: { cor: string; nivel: number }[] = [];
  if (printer.toners.black <= 10) critical.push({ cor: "black", nivel: printer.toners.black });
  if (printer.toners.cyan !== undefined && printer.toners.cyan <= 10) critical.push({ cor: "cyan", nivel: printer.toners.cyan });
  if (printer.toners.magenta !== undefined && printer.toners.magenta <= 10) critical.push({ cor: "magenta", nivel: printer.toners.magenta });
  if (printer.toners.yellow !== undefined && printer.toners.yellow <= 10) critical.push({ cor: "yellow", nivel: printer.toners.yellow });
  return critical;
}
