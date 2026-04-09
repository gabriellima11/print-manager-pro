import { usePrinters, useSedes, getSedeNome } from "@/hooks/usePrinterData";
import { Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RankingTable() {
  const { data: printers = [] } = usePrinters();
  const { data: sedes = [] } = useSedes();
  
  const allSorted = [...printers].sort((a, b) => b.page_count - a.page_count);
  const top5 = allSorted.slice(0, 5);

  const RankingItem = ({ p, i }: { p: any; i: number }) => (
    <div className="flex items-center gap-3">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        i === 0 ? "bg-warning/20 text-warning" : "bg-secondary text-muted-foreground"
      }`}>
        {i + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{p.nome}</p>
        <p className="text-xs text-muted-foreground">{getSedeNome(sedes, p.sede_id)}</p>
      </div>
      <span className="text-sm font-bold text-foreground">{p.page_count.toLocaleString("pt-BR")}</span>
    </div>
  );

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          < Trophy className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Top Impressoras (Uso)</h3>
        </div>
        
        {allSorted.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                Ver ranking completo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Ranking Completo de Uso
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="mt-4 pr-4 max-h-[60vh]">
                <div className="space-y-4">
                  {allSorted.map((p, i) => (
                    <RankingItem key={p.id} p={p} i={i} />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {top5.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma impressora cadastrada</p>}
        {top5.map((p, i) => (
          <RankingItem key={p.id} p={p} i={i} />
        ))}
      </div>
    </div>
  );
}
