import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import UsageChart from "@/components/dashboard/UsageChart";
import SedeChart from "@/components/dashboard/SedeChart";
import RankingTable from "@/components/dashboard/RankingTable";
import AlertsList from "@/components/dashboard/AlertsList";
import { printers, getCriticalToners } from "@/data/mockData";
import { Printer, Wifi, WifiOff, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const total = printers.length;
  const online = printers.filter((p) => p.status === "online").length;
  const offline = total - online;
  const criticalCount = printers.filter((p) => getCriticalToners(p).length > 0).length;
  const totalPages = printers.reduce((sum, p) => sum + p.page_count, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do parque de impressoras</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total de Impressoras" value={total} icon={Printer} subtitle={`${totalPages.toLocaleString("pt-BR")} páginas`} />
          <StatsCard title="Online" value={online} icon={Wifi} variant="success" />
          <StatsCard title="Offline" value={offline} icon={WifiOff} variant="danger" />
          <StatsCard title="Toners Críticos" value={criticalCount} icon={AlertTriangle} variant="warning" subtitle="≤ 10% restante" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UsageChart />
          <SedeChart />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RankingTable />
          <AlertsList />
        </div>
      </div>
    </DashboardLayout>
  );
}
