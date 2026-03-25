import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useUsageBySede } from "@/hooks/usePrinterData";

export default function SedeChart() {
  const { data: usageBySede = [] } = useUsageBySede();

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Impressões por Sede</h3>
      <div className="h-64">
        {usageBySede.length === 0 ? (
          <p className="text-sm text-muted-foreground flex items-center justify-center h-full">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageBySede} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
              <XAxis dataKey="sede" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 22%, 11%)", border: "1px solid hsl(220, 18%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                formatter={(value: number) => [value.toLocaleString("pt-BR"), "Páginas"]}
              />
              <Bar dataKey="pages" fill="hsl(174, 100%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
