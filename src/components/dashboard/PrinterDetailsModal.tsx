import { useState, useEffect } from "react";
import { PrinterWithToners, useUpdatePrinter, useDeletePrinter, useSedes } from "@/hooks/usePrinterData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface PrinterDetailsModalProps {
  printer: PrinterWithToners | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrinterDetailsModal({ printer, isOpen, onClose }: PrinterDetailsModalProps) {
  const { data: sedes = [] } = useSedes();
  const updatePrinter = useUpdatePrinter();
  const deletePrinter = useDeletePrinter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    ip: "",
    sede_id: "",
    page_count: 0,
    mac_address: "",
    tipo: "",
    modelo: "",
    patrimonio: "",
  });

  // Reset form when printer changes
  useEffect(() => {
    if (printer) {
      setFormData({
        nome: printer.nome,
        ip: printer.ip,
        sede_id: printer.sede_id,
        page_count: printer.page_count,
        mac_address: printer.mac_address || "",
        tipo: printer.tipo || "MONO",
        modelo: printer.modelo || "",
        patrimonio: printer.patrimonio || "",
      });
      setIsEditing(false);
    }
  }, [printer]);

  const handleSave = async () => {
    if (!printer) return;
    
    try {
      await updatePrinter.mutateAsync({
        id: printer.id,
        nome: formData.nome,
        ip: formData.ip,
        sede_id: formData.sede_id,
        page_count: Number(formData.page_count),
        mac_address: formData.mac_address || null,
        tipo: formData.tipo,
        modelo: formData.modelo || null,
        patrimonio: formData.patrimonio || null,
      });
      
      toast.success("Impressora atualizada com sucesso");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Erro ao atualizar: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!printer) return;
    setIsDeleting(true);
    try {
      await deletePrinter.mutateAsync(printer.id);
      toast.success("Impressora e dados relacionados foram excluídos.");
      onClose();
    } catch (error: any) {
      toast.error(`Erro ao excluir: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!printer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Impressora</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço IP</label>
              <input
                type="text"
                value={formData.ip}
                onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                readOnly={!isEditing}
                placeholder={isEditing ? "Ex: HP LaserJet Pro" : "-"}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
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
                readOnly={!isEditing}
                placeholder={isEditing ? "Ex: 00:1A:2B:3C:4D:5E" : "-"}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
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
                readOnly={!isEditing}
                placeholder={isEditing ? "Ex: PAT-123456" : "-"}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sede</label>
              <select
                value={formData.sede_id}
                onChange={(e) => setFormData(prev => ({ ...prev, sede_id: e.target.value }))}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted opacity-100"}`}
              >
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contador de Páginas</label>
              <input
                type="number"
                value={formData.page_count}
                onChange={(e) => setFormData(prev => ({ ...prev, page_count: Number(e.target.value) }))}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${isEditing ? "bg-secondary border border-border focus:ring-2 focus:ring-primary/50" : "bg-muted opacity-100"}`}
              >
                <option value="MONO">Monocromática</option>
                <option value="COLOR">Colorida</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-2">
               <div className="space-y-1 p-3 bg-secondary/50 rounded-lg">
                 <span className="text-xs text-muted-foreground block">Status</span>
                 <span className={`text-sm font-medium ${printer.status === 'online' ? 'text-success' : 'text-destructive'}`}>
                   {printer.status === 'online' ? 'Online' : 'Offline'}
                 </span>
               </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-between items-center mt-4">
          {!isEditing ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  if (confirm("Tem certeza que deseja excluir esta impressora? Todos os eventos e contadores dela serão apagados.")) {
                    handleDelete();
                  }
                }}
                disabled={isDeleting}
                className="bg-destructive/10 text-destructive py-2 px-3 rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center shrink-0"
                title="Excluir Impressora"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Editar Detalhes
              </button>
            </div>
          ) : (
             <div className="flex gap-2 w-full">
               <button
                 onClick={() => {
                   setIsEditing(false);
                   setFormData({
                      nome: printer.nome,
                      ip: printer.ip,
                      sede_id: printer.sede_id,
                      page_count: printer.page_count,
                      mac_address: printer.mac_address || "",
                      tipo: printer.tipo || "MONO",
                      modelo: printer.modelo || "",
                      patrimonio: printer.patrimonio || "",
                   });
                 }}
                 disabled={updatePrinter.isPending}
                 className="flex-1 bg-secondary text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
               >
                 Cancelar
               </button>
               <button
                 onClick={handleSave}
                 disabled={updatePrinter.isPending}
                 className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex justify-center items-center"
               >
                 {updatePrinter.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Alterações"}
               </button>
             </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
