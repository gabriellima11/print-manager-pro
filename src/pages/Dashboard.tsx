import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import UsageChart from "@/components/dashboard/UsageChart";
import SedeChart from "@/components/dashboard/SedeChart";
import RankingTable from "@/components/dashboard/RankingTable";
import AlertsList from "@/components/dashboard/AlertsList";
import { usePrinters, getCriticalToners } from "@/hooks/usePrinterData";
import { Printer, Wifi, WifiOff, AlertTriangle, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: printers = [], isLoading } = usePrinters();

  const total = printers.length;
  const online = printers.filter((p) => p.status === "online").length;
  const offline = total - online;
  const criticalCount = printers.filter((p) => getCriticalToners(p).length > 0).length;
  const totalPages = printers.reduce((sum, p) => sum + p.page_count, 0);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do parque de impressoras</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard title="Total de Impressoras" value={total} icon={Printer} subtitle={`${totalPages.toLocaleString("pt-BR")} páginas`} />
          <StatsCard title="Online" value={online} icon={Wifi} variant="success" />
          <StatsCard title="Offline" value={offline} icon={WifiOff} variant="danger" />
          <StatsCard title="Toners Críticos" value={criticalCount} icon={AlertTriangle} variant="warning" subtitle="≤ 10% restante" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <UsageChart />
          <SedeChart />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <RankingTable />
          <AlertsList />
        </div>
      </div>
    </DashboardLayout>
  );
}
