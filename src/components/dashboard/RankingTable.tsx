import { printers, getSedeNome } from "@/data/mockData";
import { Trophy } from "lucide-react";

export default function RankingTable() {
  const sorted = [...printers].sort((a, b) => b.page_count - a.page_count).slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-warning" />
        <h3 className="text-sm font-semibold text-foreground">Top Impressoras (Uso)</h3>
      </div>
      <div className="space-y-3">
        {sorted.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 ? "bg-warning/20 text-warning" : "bg-secondary text-muted-foreground"
            }`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.nome}</p>
              <p className="text-xs text-muted-foreground">{getSedeNome(p.sede_id)}</p>
            </div>
            <span className="text-sm font-bold text-foreground">{p.page_count.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
