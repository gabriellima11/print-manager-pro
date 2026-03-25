import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type EstoqueToner = Database["public"]["Tables"]["estoque_toners"]["Row"];

export function useEstoqueToners() {
  return useQuery({
    queryKey: ["estoque_toners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estoque_toners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as EstoqueToner[];
    },
  });
}

export function useAddEstoqueToner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novoToner: Database["public"]["Tables"]["estoque_toners"]["Insert"]) => {
      const { data, error } = await supabase.from("estoque_toners").insert(novoToner).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque_toners"] });
    },
  });
}

export function useUpdateEstoqueToner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Database["public"]["Tables"]["estoque_toners"]["Update"] & { id: string }) => {
      const { id, ...data } = updates;
      const { data: updated, error } = await supabase
        .from("estoque_toners")
        .update(data)
        .eq("id", id)
        .select();
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque_toners"] });
    },
  });
}

export function useDeleteEstoqueToner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("estoque_toners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque_toners"] });
    },
  });
}
