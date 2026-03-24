import DashboardLayout from "@/components/layout/DashboardLayout";
import { printers, sedes, getSedeNome } from "@/data/mockData";
import { FileText, Download } from "lucide-react";

export default function Relatorios() {
  const sedeStats = sedes.map((s) => {
    const sedePrinters = printers.filter((p) => p.sede_id === s.id);
    const totalPages = sedePrinters.reduce((sum, p) => sum + p.page_count, 0);
    const offlineCount = sedePrinters.filter((p) => p.status === "offline").length;
    return { ...s, printerCount: sedePrinters.length, totalPages, offlineCount };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground mt-1">Relatórios mensais de uso</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Summary table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Resumo por Sede — Março 2026</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Sede</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Impressoras</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Total Páginas</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Offline</th>
                </tr>
              </thead>
              <tbody>
                {sedeStats.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 text-foreground font-medium">{s.nome}</td>
                    <td className="p-4 text-center text-foreground">{s.printerCount}</td>
                    <td className="p-4 text-center text-foreground font-semibold">{s.totalPages.toLocaleString("pt-BR")}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.offlineCount > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                        {s.offlineCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
