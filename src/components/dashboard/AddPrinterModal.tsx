import { useState } from "react";
import { useAddPrinter, useSedes } from "@/hooks/usePrinterData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPrinterModal({ isOpen, onClose }: AddPrinterModalProps) {
  const { data: sedes = [] } = useSedes();
  const addPrinter = useAddPrinter();
  
  const [formData, setFormData] = useState({
    nome: "",
    ip: "",
    sede_id: "",
    tipo: "MONO",
    modelo: "",
    mac_address: "",
    patrimonio: "",
  });

  const handleSave = async () => {
    if (!formData.nome || !formData.ip || !formData.sede_id) {
      toast.error("Por favor, preencha os campos obrigatórios (Nome, IP, Sede)");
      return;
    }
    
    try {
      await addPrinter.mutateAsync({
        nome: formData.nome,
        ip: formData.ip,
        sede_id: formData.sede_id,
        tipo: formData.tipo,
        modelo: formData.modelo || null,
        mac_address: formData.mac_address || null,
        patrimonio: formData.patrimonio || null,
      });
      
      toast.success("Impressora adicionada com sucesso");
      onClose();
      setFormData({
        nome: "",
        ip: "",
        sede_id: "",
        tipo: "MONO",
        modelo: "",
        mac_address: "",
        patrimonio: "",
      });
    } catch (error: any) {
      toast.error(`Erro ao adicionar: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Impressora</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Impressora Recepção"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço IP *</label>
              <input
                type="text"
                value={formData.ip}
                onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                placeholder="Ex: 192.168.1.50"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sede *</label>
              <select
                value={formData.sede_id}
                onChange={(e) => setFormData(prev => ({ ...prev, sede_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione uma sede</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                placeholder="Ex: HP LaserJet Pro"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Patrimônio <span className="text-muted-foreground font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={formData.patrimonio}
                onChange={(e) => setFormData(prev => ({ ...prev, patrimonio: e.target.value }))}
                placeholder="Ex: PAT-123456"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Endereço MAC <span className="text-muted-foreground font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={formData.mac_address}
                onChange={(e) => setFormData(prev => ({ ...prev, mac_address: e.target.value }))}
                placeholder="Ex: 00:1A:2B:3C:4D:5E"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
              >
                <option value="MONO">Monocromática</option>
                <option value="COLOR">Colorida</option>
              </select>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <button
            onClick={onClose}
            disabled={addPrinter.isPending}
            className="flex-1 bg-secondary text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={addPrinter.isPending}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex justify-center items-center"
          >
            {addPrinter.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
