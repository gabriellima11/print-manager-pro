import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
      headers: corsHeaders
    });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const payload: EmailPayload = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Print Manager Pro <gabrielflima05@gmail.com>",
      to: ["gabriel.lima@southti.com.br"],
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
    });

    if (error) {
      console.error("Erro no Resend:", error);
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
