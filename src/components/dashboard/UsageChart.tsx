import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function UsageChart() {
  const { data: usageByMonth = [] } = useQuery({
    queryKey: ["usage-by-month"],
    queryFn: async () => {
      // Get recent readings grouped by month
      const { data, error } = await supabase
        .from("leituras")
        .select("page_count, timestamp")
        .order("timestamp", { ascending: true });
      if (error) throw error;

      const monthMap = new Map<string, number>();
      for (const r of data ?? []) {
        const d = new Date(r.timestamp);
        const key = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
        monthMap.set(capitalized, (monthMap.get(capitalized) ?? 0) + r.page_count);
      }

      // If no data, return empty
      if (monthMap.size === 0) return [];

      return Array.from(monthMap.entries()).map(([month, pages]) => ({ month, pages }));
    },
  });

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Impressões por Mês</h3>
      <div className="h-64">
        {usageByMonth.length === 0 ? (
          <p className="text-sm text-muted-foreground flex items-center justify-center h-full">Sem dados de leituras</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 100%, 42%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 100%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 22%, 11%)", border: "1px solid hsl(220, 18%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                formatter={(value: number) => [value.toLocaleString("pt-BR"), "Páginas"]}
              />
              <Area type="monotone" dataKey="pages" stroke="hsl(174, 100%, 42%)" strokeWidth={2} fill="url(#colorPages)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
