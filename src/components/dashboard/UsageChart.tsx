import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function UsageChart() {
  const { data: chartData } = useQuery({
    queryKey: ["usage-by-month-sede"],
    queryFn: async () => {
      const { data: sedes, error: sErr } = await supabase.from("sedes").select("*");
      if (sErr) throw sErr;

      const { data: leituras, error: lErr } = await supabase
        .from("leituras")
        .select(`
          page_count,
          timestamp,
          impressoras (
            sede_id
          )
        `)
        .order("timestamp", { ascending: true });
      if (lErr) throw lErr;

      const monthMap = new Map<string, Record<string, number>>();
      const sedeNames = new Set<string>();

      for (const r of leituras ?? []) {
        const printer = r.impressoras as any;
        if (!printer?.sede_id) continue;

        const sedeId = printer.sede_id;
        const sedeObj = sedes?.find(s => s.id === sedeId);
        const sedeName = sedeObj?.nome || "Desconhecido";
        sedeNames.add(sedeName);

        const d = new Date(r.timestamp);
        const monthKey = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
        const capitalizedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

        if (!monthMap.has(capitalizedMonth)) {
          monthMap.set(capitalizedMonth, {});
        }
        const monthData = monthMap.get(capitalizedMonth)!;
        monthData[sedeName] = (monthData[sedeName] || 0) + r.page_count;
      }

      const formattedData = Array.from(monthMap.entries()).map(([month, sedesData]) => ({
        month,
        ...sedesData,
      }));

      return {
        data: formattedData,
        sedes: Array.from(sedeNames),
      };
    },
  });

  const colors = [
    "hsl(174, 100%, 42%)", // Teal
    "hsl(217, 91%, 60%)",  // Blue
    "hsl(280, 67%, 60%)",  // Purple
    "hsl(30, 100%, 50%)",  // Orange
    "hsl(0, 100%, 60%)",   // Red
    "hsl(142, 71%, 45%)",  // Green
  ];

  const usageByMonth = chartData?.data || [];
  const sedesList = chartData?.sedes || [];

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
                {sedesList.map((sede, idx) => (
                  <linearGradient key={`gradient-${sede}`} id={`color-${sede}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "hsl(220, 22%, 11%)", 
                  border: "1px solid hsl(220, 18%, 18%)", 
                  borderRadius: "8px", 
                  color: "hsl(210, 40%, 96%)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                formatter={(value: number, name: string) => [`${value.toLocaleString("pt-BR")} páginas`, name]}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px', fontSize: '11px', fontWeight: '500' }}
              />
              {sedesList.map((sede, idx) => (
                <Area 
                  key={sede}
                  type="monotone" 
                  dataKey={sede} 
                  stroke={colors[idx % colors.length]} 
                  strokeWidth={2} 
                  fill={`url(#color-${sede})`} 
                  stackId="1"
                  activeDot={{ r: 6, strokeWidth: 0, fill: colors[idx % colors.length] }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
