import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSedes, usePrinters, getCriticalToners } from "@/hooks/usePrinterData";
import { Building2, Printer, Wifi, WifiOff, AlertTriangle, Loader2 } from "lucide-react";

export default function Sedes() {
  const { data: sedes = [], isLoading: sedesLoading } = useSedes();
  const { data: printers = [], isLoading: printersLoading } = usePrinters();
  const isLoading = sedesLoading || printersLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sedes</h1>
          <p className="text-sm text-muted-foreground mt-1">{sedes.length} sedes monitoradas</p>
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
                <div key={sede.id} className="glass-card rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{sede.nome}</h3>
                      <p className="text-xs text-muted-foreground">{sedePrinters.length} impressoras</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
    </DashboardLayout>
  );
}
