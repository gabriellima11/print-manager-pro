import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEventos, usePrinters, useSedes, getSedeNome } from "@/hooks/usePrinterData";
import { AlertTriangle, WifiOff, Loader2 } from "lucide-react";

const corLabel: Record<string, string> = {
  black: "Preto", cyan: "Ciano", magenta: "Magenta", yellow: "Amarelo",
};

export default function Alertas() {
  const { data: eventos = [], isLoading } = useEventos();
  const { data: printers = [] } = usePrinters();
  const { data: sedes = [] } = useSedes();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground mt-1">{eventos.length} alertas registrados</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {eventos.length === 0 && <p className="text-muted-foreground text-center py-12">Nenhum alerta registrado</p>}
            {eventos.map((e) => {
              const printer = printers.find((p) => p.id === e.impressora_id);
              const isOffline = e.tipo === "offline";
              return (
                <div key={e.id} className={`glass-card rounded-xl p-4 flex items-start gap-4 ${isOffline ? "border-destructive/20" : "border-warning/20"}`}>
                  <div className={`p-2 rounded-lg ${isOffline ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                    {isOffline ? <WifiOff className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{printer?.nome ?? "Impressora"}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOffline ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                        {isOffline ? "Offline" : "Toner Baixo"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isOffline ? "Sem resposta SNMP — impressora offline" : `Toner ${corLabel[e.cor!] ?? e.cor} abaixo de 10%`}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>IP: {printer?.ip}</span>
                      <span>Sede: {getSedeNome(sedes, printer?.sede_id ?? "")}</span>
                      <span>{new Date(e.timestamp).toLocaleString("pt-BR")}</span>
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
