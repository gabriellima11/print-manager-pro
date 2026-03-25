import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEstoqueToners, EstoqueToner, useDeleteEstoqueToner } from "@/hooks/useEstoqueToners";
import { useSedes, getSedeNome } from "@/hooks/usePrinterData";
import EstoqueTonerModal from "@/components/dashboard/EstoqueTonerModal";
import { Plus, Package, Edit2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Estoque() {
  const { data: toners = [], isLoading: tonersLoading } = useEstoqueToners();
  const { data: sedes = [], isLoading: sedesLoading } = useSedes();
  const deleteToner = useDeleteEstoqueToner();
  
  const [selectedSedeId, setSelectedSedeId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToner, setEditingToner] = useState<EstoqueToner | null>(null);

  const isLoading = tonersLoading || sedesLoading;

  const filteredToners = selectedSedeId === "all" 
    ? toners 
    : toners.filter(t => t.sede_id === selectedSedeId);

  const handleEdit = (toner: EstoqueToner) => {
    setEditingToner(toner);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingToner(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este toner do estoque?")) {
      try {
        await deleteToner.mutateAsync(id);
        toast.success("Toner removido com sucesso");
      } catch (error: any) {
        toast.error(`Erro ao remover: ${error.message}`);
      }
    }
  };

  const getColorLabel = (cor: string) => {
    const labels: Record<string, string> = {
      BLACK: "Preto", CYAN: "Ciano", MAGENTA: "Magenta", YELLOW: "Amarelo"
    };
    return labels[cor] || cor;
  };

  const getColorClass = (cor: string) => {
    switch (cor) {
      case 'BLACK': return 'bg-gray-800 text-white';
      case 'CYAN': return 'bg-cyan-500 text-white';
      case 'MAGENTA': return 'bg-fuchsia-500 text-white';
      case 'YELLOW': return 'bg-yellow-400 text-black';
      default: return 'bg-secondary text-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Estoque de Toners</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie o inventário por sede</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Adicionar Toner
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSedeId("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSedeId === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas as Sedes
          </button>
          {sedes.map((sede) => (
            <button
              key={sede.id}
              onClick={() => setSelectedSedeId(sede.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSedeId === sede.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {sede.nome}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredToners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-secondary/30 rounded-xl border border-border/50">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nenhum toner encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Não há registros de toners para a sede selecionada. Adicione novos toners para começar a controlar o estoque.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredToners.map((toner) => {
              const isLowStock = toner.quantidade <= toner.quantidade_minima;
              return (
                <div key={toner.id} className="glass-card rounded-xl p-5 relative group transition-all hover:border-primary/30">
                  <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <button 
                      onClick={() => handleEdit(toner)}
                      className="p-1.5 bg-secondary text-foreground hover:text-primary rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(toner.id)}
                      className="p-1.5 bg-secondary text-foreground hover:text-destructive rounded-md transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${getColorClass(toner.cor)} bg-opacity-90`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="pr-12">
                      <h3 className="font-semibold text-foreground leading-tight truncate" title={toner.modelo}>{toner.modelo}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{getSedeNome(sedes, toner.sede_id)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-secondary/40">
                      <span className="text-muted-foreground">Cor</span>
                      <span className="font-medium">{getColorLabel(toner.cor)}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm p-2 rounded-lg bg-secondary/40">
                      <span className="text-muted-foreground text-xs">Impressoras Compatíveis</span>
                      <span className="font-medium text-xs truncate" title={toner.impressora_compativel}>{toner.impressora_compativel}</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isLowStock ? "bg-destructive/10 border-destructive/20" : "bg-secondary/20 border-border/50"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Estoque</span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`text-xl font-bold leading-none ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                          {toner.quantidade}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">mín. {toner.quantidade_minima}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EstoqueTonerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toner={editingToner}
      />
    </DashboardLayout>
  );
}
