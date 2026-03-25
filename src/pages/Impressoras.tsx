import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PrinterCard from "@/components/dashboard/PrinterCard";
import { usePrinters, useSedes } from "@/hooks/usePrinterData";
import { Search, Loader2 } from "lucide-react";

export default function Impressoras() {
  const [search, setSearch] = useState("");
  const [sedeFilter, setSedeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: printers = [], isLoading } = usePrinters();
  const { data: sedes = [] } = useSedes();

  const filtered = printers.filter((p) => {
    if (search && !p.nome.toLowerCase().includes(search.toLowerCase()) && !p.ip.includes(search)) return false;
    if (sedeFilter !== "all" && p.sede_id !== sedeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Impressoras</h1>
          <p className="text-sm text-muted-foreground mt-1">{printers.length} dispositivos monitorados</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={sedeFilter}
            onChange={(e) => setSedeFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Todas as sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Todos os status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PrinterCard key={p.id} printer={p} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma impressora encontrada.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
