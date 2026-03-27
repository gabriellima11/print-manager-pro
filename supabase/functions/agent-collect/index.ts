import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-agent-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate agent by token
    const agentToken = req.headers.get("x-agent-token");
    if (!agentToken) {
      return new Response(JSON.stringify({ error: "Missing agent token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: agent, error: agentError } = await supabase
      .from("agentes")
      .select("id, sede_id, ativo")
      .eq("token", agentToken)
      .single();

    if (agentError || !agent || !agent.ativo) {
      return new Response(JSON.stringify({ error: "Invalid or inactive agent token" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update agent last_seen
    await supabase.from("agentes").update({ last_seen: new Date().toISOString() }).eq("id", agent.id);

    const body = await req.json();
    const printers: Array<{
      printer_name: string;
      ip: string;
      model?: string;
      status: "online" | "offline";
      page_count: number;
      toners: Record<string, number>;
    }> = body.printers ?? [body]; // Support single or array

    const results = [];

    for (const p of printers) {
      // Check if printer exists
      const { data: existingPrinter } = await supabase
        .from("impressoras")
        .select("id, status")
        .eq("ip", p.ip)
        .eq("sede_id", agent.sede_id)
        .maybeSingle();

      let printer;
      let printerError;

      if (existingPrinter) {
        // Update only allowed fields
        const { data, error } = await supabase
          .from("impressoras")
          .update({
            status: p.status,
            page_count: p.page_count,
            last_seen: new Date().toISOString()
          })
          .eq("id", existingPrinter.id)
          .select("id, status")
          .single();
          
        printer = data;
        printerError = error;
      } else {
        // Insert new printer
        const tipo = Object.keys(p.toners).length > 1 ? "COLOR" : "MONO";
        const { data, error } = await supabase
          .from("impressoras")
          .insert({
            nome: p.printer_name,
            ip: p.ip,
            modelo: p.model ?? null,
            tipo,
            sede_id: agent.sede_id,
            status: p.status,
            page_count: p.page_count,
            last_seen: new Date().toISOString()
          })
          .select("id, status")
          .single();
          
        printer = data;
        printerError = error;
      }

      if (printerError || !printer) {
        console.error("Printer upsert error:", printerError);
        results.push({ ip: p.ip, error: printerError?.message ?? "Unknown error" });
        continue;
      }

      // Upsert toners
      for (const [color, level] of Object.entries(p.toners)) {
        const cor = color.toUpperCase();
        await supabase.from("toners").upsert(
          { impressora_id: printer.id, cor, nivel_atual: level },
          { onConflict: "impressora_id,cor" }
        );

        // Record toner history
        await supabase.from("leituras_toner").insert({
          impressora_id: printer.id,
          cor,
          nivel: level,
        });

        // Check critical toner and create event
        if (level <= 10) {
          const corLabel: Record<string, string> = {
            BLACK: "Preto", CYAN: "Ciano", MAGENTA: "Magenta", YELLOW: "Amarelo",
          };
          // Check if there's already an unresolved alert for this toner
          const { data: existing } = await supabase
            .from("eventos")
            .select("id")
            .eq("impressora_id", printer.id)
            .eq("tipo", "toner_baixo")
            .eq("cor", cor)
            .eq("resolvido", false)
            .limit(1);

          if (!existing || existing.length === 0) {
            await supabase.from("eventos").insert({
              impressora_id: printer.id,
              tipo: "toner_baixo",
              descricao: `${corLabel[cor] ?? cor} abaixo de 10% (${level}%)`,
              cor,
            });
          }
        }
      }

      // Record reading history
      await supabase.from("leituras").insert({
        impressora_id: printer.id,
        page_count: p.page_count,
        status: p.status,
      });

      // Check offline and create event
      if (p.status === "offline") {
        const { data: existing } = await supabase
          .from("eventos")
          .select("id")
          .eq("impressora_id", printer.id)
          .eq("tipo", "offline")
          .eq("resolvido", false)
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabase.from("eventos").insert({
            impressora_id: printer.id,
            tipo: "offline",
            descricao: "Impressora offline - sem resposta SNMP",
          });
        }
      }

      results.push({ ip: p.ip, id: printer.id, status: "ok" });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Agent collect error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
