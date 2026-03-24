import { Printer as PrinterType, getSedeNome } from "@/data/mockData";
import TonerBar from "./TonerBar";
import { Wifi, WifiOff } from "lucide-react";

interface PrinterCardProps {
  printer: PrinterType;
}

export default function PrinterCard({ printer }: PrinterCardProps) {
  const isOnline = printer.status === "online";

  return (
    <div className={`glass-card rounded-xl p-5 transition-all hover:border-primary/30 ${!isOnline ? "border-destructive/30" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{printer.nome}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{printer.ip} · {getSedeNome(printer.sede_id)}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          isOnline ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Page count */}
      <div className="flex items-center justify-between mb-4 py-2 px-3 rounded-lg bg-secondary/50">
        <span className="text-xs text-muted-foreground">Páginas impressas</span>
        <span className="text-sm font-bold text-foreground">{printer.page_count.toLocaleString("pt-BR")}</span>
      </div>

      {/* Toners */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Toners {printer.tipo === "COLOR" ? "(CMYK)" : "(Mono)"}
        </p>
        <TonerBar color="black" level={printer.toners.black} />
        {printer.tipo === "COLOR" && (
          <>
            <TonerBar color="cyan" level={printer.toners.cyan!} />
            <TonerBar color="magenta" level={printer.toners.magenta!} />
            <TonerBar color="yellow" level={printer.toners.yellow!} />
          </>
        )}
      </div>
    </div>
  );
}
