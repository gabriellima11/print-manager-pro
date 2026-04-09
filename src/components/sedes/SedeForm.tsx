import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAddSede, useUpdateSede, Sede } from "@/hooks/usePrinterData";

interface SedeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sede?: Sede | null;
}

export default function SedeForm({ open, onOpenChange, sede }: SedeFormProps) {
  const [nome, setNome] = useState("");
  const isEditing = !!sede;

  const addSede = useAddSede();
  const updateSede = useUpdateSede();
  const isLoading = addSede.isPending || updateSede.isPending;

  useEffect(() => {
    if (sede) {
      setNome(sede.nome);
    } else {
      setNome("");
    }
  }, [sede, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("O nome da sede é obrigatório");
      return;
    }

    try {
      if (isEditing && sede) {
        await updateSede.mutateAsync({ id: sede.id, nome: nome.trim() });
        toast.success("Sede atualizada com sucesso");
      } else {
        await addSede.mutateAsync(nome.trim());
        toast.success("Sede adicionada com sucesso");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar sede");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sede" : "Adicionar Sede"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Sede</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Matriz, Filial Norte..."
              className="bg-secondary/50 border-border/50 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Adicionar Sede"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
