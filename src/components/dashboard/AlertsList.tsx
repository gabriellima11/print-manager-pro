import { useEventos, usePrinters, useSedes, getSedeNome } from "@/hooks/usePrinterData";
import { AlertTriangle, WifiOff } from "lucide-react";

const corLabel: Record<string, string> = {
  black: "Preto",
  cyan: "Ciano",
  magenta: "Magenta",
  yellow: "Amarelo",
};

export default function AlertsList({ limit = 5 }: { limit?: number }) {
  const { data: eventos = [] } = useEventos(limit);
  const { data: printers = [] } = usePrinters();
  const { data: sedes = [] } = useSedes();

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground">Alertas Recentes</h3>
      </div>
      <div className="space-y-3">
        {eventos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum alerta recente</p>}
        {eventos.map((e) => {
          const printer = printers.find((p) => p.id === e.impressora_id);
          const isOffline = e.tipo === "offline";
          return (
            <div key={e.id} className={`flex items-start gap-3 p-3 rounded-lg ${isOffline ? "bg-destructive/5" : "bg-warning/5"}`}>
              <div className={`p-1.5 rounded-md mt-0.5 ${isOffline ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{printer?.nome ?? "Impressora"}</p>
                <p className="text-xs text-muted-foreground">
                  {isOffline ? "Impressora offline" : `Toner ${corLabel[e.cor!] ?? e.cor} ≤ 10%`}
                  {" · "}{getSedeNome(sedes, printer?.sede_id ?? "")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(e.timestamp).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
