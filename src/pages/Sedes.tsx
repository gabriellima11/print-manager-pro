import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSedes, usePrinters, getCriticalToners, useDeleteSede, Sede } from "@/hooks/usePrinterData";
import { Building2, Printer, Wifi, WifiOff, AlertTriangle, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SedeForm from "@/components/sedes/SedeForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Sedes() {
  const { data: sedes = [], isLoading: sedesLoading } = useSedes();
  const { data: printers = [], isLoading: printersLoading } = usePrinters();
  const deleteSede = useDeleteSede();
  
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isLoading = sedesLoading || printersLoading;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSede.mutateAsync(deleteId);
      toast.success("Sede excluída com sucesso");
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir sede");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sedes</h1>
            <p className="text-sm text-muted-foreground mt-1">{sedes.length} sedes monitoradas</p>
          </div>
          <Button onClick={() => { setSelectedSede(null); setFormOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Sede
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sedes.map((sede) => {
              const sedePrinters = printers.filter((p) => p.sede_id === sede.id);
              const online = sedePrinters.filter((p) => p.status === "online").length;
              const offline = sedePrinters.length - online;
              const critical = sedePrinters.filter((p) => getCriticalToners(p).length > 0).length;
              const totalPages = sedePrinters.reduce((sum, p) => sum + p.page_count, 0);

              return (
                <div key={sede.id} className="group glass-card rounded-xl p-5 space-y-4 relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{sede.nome}</h3>
                        <p className="text-xs text-muted-foreground">{sedePrinters.length} impressoras</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => { setSelectedSede(sede); setFormOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(sede.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* ... (stats grid) */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                      <Wifi className="w-3.5 h-3.5 text-success" />
                      <span className="text-xs text-muted-foreground">Online:</span>
                      <span className="text-xs font-bold text-foreground">{online}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                      <WifiOff className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs text-muted-foreground">Offline:</span>
                      <span className="text-xs font-bold text-foreground">{offline}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                      <Printer className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Páginas:</span>
                      <span className="text-xs font-bold text-foreground">{(totalPages / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                      <span className="text-xs text-muted-foreground">Críticos:</span>
                      <span className="text-xs font-bold text-foreground">{critical}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SedeForm open={formOpen} onOpenChange={setFormOpen} sede={selectedSede} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Sede</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta sede? Esta ação não pode ser desfeita.
              Sedes com impressoras vinculadas não podem ser excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
