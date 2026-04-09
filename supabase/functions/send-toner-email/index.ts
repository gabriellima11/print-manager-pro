const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

interface EmailPayload {
  data_hora: string;
  patrimonio: string;
  modelo_toner: string;
  sede: string;
  cor: string;
  quantidade_anterior: number;
  quantidade_nova: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: EmailPayload = await req.json();

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Print Manager Pro <onboarding@resend.dev>",
        to: ["gabrielflima05@gmail.com"],
        subject: `Notificação de Retirada de Toner - ${payload.sede}`,
        html: `
          <h1>Notificação de Retirada de Toner</h1>
          <p>Uma retirada de toner foi registrada no sistema.</p>
          <ul>
            <li><strong>Data/Hora:</strong> ${payload.data_hora}</li>
            <li><strong>Sede:</strong> ${payload.sede}</li>
            <li><strong>Modelo do Toner:</strong> ${payload.modelo_toner}</li>
            <li><strong>Cor:</strong> ${payload.cor}</li>
            <li><strong>Patrimônio da Impressora Destino:</strong> ${payload.patrimonio}</li>
            <li><strong>Quantidade Anterior:</strong> ${payload.quantidade_anterior}</li>
            <li><strong>Quantidade Nova:</strong> ${payload.quantidade_nova}</li>
          </ul>
          <p>Esta é uma mensagem automática do Print Manager Pro.</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro no Resend:", data);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("E-mail enviado com sucesso:", data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro na Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
