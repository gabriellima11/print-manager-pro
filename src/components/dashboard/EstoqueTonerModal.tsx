import { useState, useEffect } from "react";
import { EstoqueToner, useAddEstoqueToner, useUpdateEstoqueToner } from "@/hooks/useEstoqueToners";
import { useSedes } from "@/hooks/usePrinterData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EstoqueTonerModalProps {
  isOpen: boolean;
  onClose: () => void;
  toner: EstoqueToner | null;
}

export default function EstoqueTonerModal({ isOpen, onClose, toner }: EstoqueTonerModalProps) {
  const { data: sedes = [] } = useSedes();
  const addToner = useAddEstoqueToner();
  const updateToner = useUpdateEstoqueToner();
  
  const [formData, setFormData] = useState({
    modelo: "",
    cor: "BLACK",
    impressora_compativel: "",
    quantidade: 0,
    quantidade_minima: 5,
    sede_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (toner) {
        setFormData({
          modelo: toner.modelo,
          cor: toner.cor,
          impressora_compativel: toner.impressora_compativel,
          quantidade: toner.quantidade,
          quantidade_minima: toner.quantidade_minima,
          sede_id: toner.sede_id,
        });
      } else {
        setFormData({
          modelo: "",
          cor: "BLACK",
          impressora_compativel: "",
          quantidade: 0,
          quantidade_minima: 2,
          sede_id: sedes[0]?.id || "",
        });
      }
    }
  }, [isOpen, toner, sedes]);

  const handleSave = async () => {
    if (!formData.modelo || !formData.impressora_compativel || !formData.sede_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (toner) {
        await updateToner.mutateAsync({
          id: toner.id,
          ...formData,
        });
        toast.success("Toner atualizado com sucesso!");
      } else {
        await addToner.mutateAsync(formData);
        toast.success("Toner adicionado com sucesso!");
      }
      onClose();
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const isPending = addToner.isPending || updateToner.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{toner ? "Editar Toner no Estoque" : "Adicionar Toner ao Estoque"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sede da Instalação *</label>
            <select
              value={formData.sede_id}
              onChange={(e) => setFormData(prev => ({ ...prev, sede_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Selecione uma sede</option>
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo do Toner *</label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
              placeholder="Ex: CF283A"
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cor *</label>
            <select
              value={formData.cor}
              onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
            >
              <option value="BLACK">Preto (Black)</option>
              <option value="CYAN">Ciano (Cyan)</option>
              <option value="MAGENTA">Magenta (Magenta)</option>
              <option value="YELLOW">Amarelo (Yellow)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Impressoras Compatíveis *</label>
            <input
              type="text"
              value={formData.impressora_compativel}
              onChange={(e) => setFormData(prev => ({ ...prev, impressora_compativel: e.target.value }))}
              placeholder="Ex: HP M125, M127..."
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Qtd em Estoque</label>
              <input
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estoque Mínimo</label>
              <input
                type="number"
                min="0"
                value={formData.quantidade_minima}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade_minima: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="bg-secondary text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
