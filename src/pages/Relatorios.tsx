import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePrinters, useSedes, getSedeNome, getCriticalToners } from "@/hooks/usePrinterData";
import { 
  FileText, 
  Download, 
  Loader2, 
  Printer, 
  Building2, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Search
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportRelatorioGeral, exportRelatorioSedes, exportRelatorioIndividual, exportRelatorioUnico } from "@/utils/pdfExport";
import { useEffect } from "react";

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState("geral");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSedeIds, setSelectedSedeIds] = useState<string[]>([]);
  const { data: sedes = [], isLoading: sLoading } = useSedes();
  const { data: printers = [], isLoading: pLoading } = usePrinters();
  const isLoading = sLoading || pLoading;

  // Initialize selection with all branch IDs when they are loaded
  useEffect(() => {
    if (sedes.length > 0 && selectedSedeIds.length === 0) {
      setSelectedSedeIds(sedes.map(s => s.id));
    }
  }, [sedes]);

  const totalPages = printers.reduce((sum, p) => sum + (p.page_count || 0), 0);
  const onlineCount = printers.filter((p) => p.status === "online").length;
  const offlineCount = printers.length - onlineCount;
  const criticalTonersPrinters = printers.filter((p) => getCriticalToners(p).length > 0).length;

  const sedeStats = sedes.map((s) => {
    const sedePrinters = printers.filter((p) => p.sede_id === s.id);
    const totalPagesSede = sedePrinters.reduce((sum, p) => sum + (p.page_count || 0), 0);
    const offlineCountSede = sedePrinters.filter((p) => p.status === "offline").length;
    return { ...s, printerCount: sedePrinters.length, totalPages: totalPagesSede, offlineCount: offlineCountSede, printers: sedePrinters };
  });

  const filteredPrinters = printers.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.patrimonio && p.patrimonio.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.ip.includes(searchTerm)
  );

  const handleSedeSelectionChange = (sedeId: string) => {
    setSelectedSedeIds(prev => 
      prev.includes(sedeId) ? prev.filter(id => id !== sedeId) : [...prev, sedeId]
    );
  };

  const handleSelectAllSedes = (checked: boolean) => {
    if (checked) {
      setSelectedSedeIds(sedes.map(s => s.id));
    } else {
      setSelectedSedeIds([]);
    }
  };

  const handleExportPDF = () => {
    if (activeTab === "geral") {
      exportRelatorioGeral(printers, sedeStats);
    } else if (activeTab === "sedes") {
      const filteredStats = sedeStats.filter(s => selectedSedeIds.includes(s.id));
      exportRelatorioSedes(filteredStats);
    } else if (activeTab === "individual") {
      exportRelatorioIndividual(filteredPrinters, sedes);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-4">
        {/* Header - Hidden on Print if needed, but usually kept for title */}
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground mt-1">Análise detalhada do parque de impressoras</p>
          </div>
          <div className="flex gap-2">
            {activeTab !== "individual" && (
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </button>
            )}
          </div>
        </div>

        <Tabs defaultValue="geral" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 print:hidden">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="sedes" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Por Sede
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Por Impressora
            </TabsTrigger>
          </TabsList>

          {/* TAB: GERAL */}
          <TabsContent value="geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total de Páginas</CardTitle>
                  <FileText className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPages.toLocaleString("pt-BR")}</div>
                  <p className="text-xs text-muted-foreground mt-1">Impressas até o momento</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Impressoras</CardTitle>
                  <Printer className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{printers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">{onlineCount} online / {offlineCount} offline</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Geral</CardTitle>
                  {offlineCount === 0 ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{offlineCount === 0 ? "Normal" : "Atenção"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{offlineCount} erros detectados</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Toners Críticos</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{criticalTonersPrinters}</div>
                  <p className="text-xs text-muted-foreground mt-1">Dispositivos abaixo de 10%</p>
                </CardContent>
              </Card>
            </div>

            {/* General table is the sede list summary */}
            <div className="glass-card rounded-xl overflow-hidden border border-border/50">
              <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Resumo Executivo</h3>
                </div>
                <span className="text-xs text-muted-foreground">Atualizado agora</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/10">
                      <th className="text-left p-4 text-muted-foreground font-medium">Sede</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Qtd Impressoras</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Volume de Impressão</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Disponibilidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sedeStats.map((s) => (
                      <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 text-foreground font-medium">{s.nome}</td>
                        <td className="p-4 text-center text-foreground">{s.printerCount}</td>
                        <td className="p-4 text-center text-foreground font-semibold">{s.totalPages.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${s.offlineCount === 0 ? "bg-success" : "bg-warning"}`} />
                            <span className="text-xs font-medium">
                              {s.offlineCount === 0 ? "100%" : `${Math.round(((s.printerCount - s.offlineCount) / s.printerCount) * 100)}%`}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB: POR SEDE */}
          <TabsContent value="sedes" className="space-y-6">
            {/* Sede Selectors */}
            <div className="glass-card p-4 rounded-xl border border-border/50 bg-secondary/5 mb-6">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/50">
                <span className="text-sm font-semibold text-foreground">Selecionar Unidades para o Relatório</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border"
                    checked={sedes.length > 0 && selectedSedeIds.length === sedes.length}
                    onChange={(e) => handleSelectAllSedes(e.target.checked)}
                  />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Selecionar Todas</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-4">
                {sedes.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-1 px-3 bg-secondary/50 rounded-full border border-border/50 cursor-pointer hover:bg-secondary transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      checked={selectedSedeIds.includes(s.id)}
                      onChange={() => handleSedeSelectionChange(s.id)}
                    />
                    <span className="text-xs font-medium text-foreground">{s.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {sedeStats.filter(s => selectedSedeIds.includes(s.id)).map((s) => (
                <div key={s.id} className="glass-card rounded-xl overflow-hidden border border-border/50">
                  <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{s.nome}</h3>
                        <p className="text-xs text-muted-foreground">{s.printerCount} dispositivos cadastrados</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Total Páginas</p>
                        <p className="text-sm font-bold text-foreground">{s.totalPages.toLocaleString("pt-BR")}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Status</p>
                        <p className={`text-sm font-bold ${s.offlineCount === 0 ? "text-success" : "text-warning"}`}>
                          {s.offlineCount === 0 ? "Online" : `${s.offlineCount} Offline`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left p-4 font-medium pl-14">Impressora</th>
                          <th className="text-left p-4 font-medium">Patrimônio</th>
                          <th className="text-center p-4 font-medium">Contador</th>
                          <th className="text-center p-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.printers.map((p) => (
                          <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/5 transition-colors">
                            <td className="p-4 pl-14">
                              <div className="font-medium text-foreground">{p.nome}</div>
                              <div className="text-[10px] text-muted-foreground">{p.modelo || p.ip}</div>
                            </td>
                            <td className="p-4 text-muted-foreground">{p.patrimonio || "-"}</td>
                            <td className="p-4 text-center font-semibold text-foreground">{p.page_count.toLocaleString("pt-BR")}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'online' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB: POR IMPRESSORA */}
          <TabsContent value="individual" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4 print:hidden">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filtrar por nome, patrimônio ou IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/10">
                      <th className="p-4 text-left text-muted-foreground font-medium">Impressora</th>
                      <th className="p-4 text-left text-muted-foreground font-medium">Patrimônio</th>
                      <th className="p-4 text-left text-muted-foreground font-medium">Sede</th>
                      <th className="p-4 text-center text-muted-foreground font-medium">Páginas</th>
                      <th className="p-4 text-center text-muted-foreground font-medium">Toner</th>
                      <th className="p-4 text-center text-muted-foreground font-medium">Status</th>
                      <th className="p-4 text-center text-muted-foreground font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrinters.map((p) => {
                      const criticals = getCriticalToners(p);
                      const sedeNome = getSedeNome(sedes, p.sede_id);
                      return (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${p.status === 'online' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                <Printer className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{p.nome}</div>
                                <div className="text-[10px] text-muted-foreground">{p.ip}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{p.patrimonio || "-"}</td>
                          <td className="p-4 text-foreground">{getSedeNome(sedes, p.sede_id)}</td>
                          <td className="p-4 text-center font-bold text-foreground">{p.page_count.toLocaleString("pt-BR")}</td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-[10px] font-bold text-foreground">K: {p.toners.black}%</div>
                              {criticals.length > 0 && (
                                <span className="text-[9px] text-destructive flex items-center gap-0.5 font-bold animate-pulse">
                                  <AlertTriangle className="w-2 h-2" />
                                  BAIXO
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                             <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                p.status === 'online' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-success' : 'bg-destructive'}`} />
                                {p.status.toUpperCase()}
                              </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => exportRelatorioUnico(p, sedeNome)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Exportar PDF Individual"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .glass-card {
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            background: white !important;
          }
          aside, nav {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
