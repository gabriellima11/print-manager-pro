import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailData {
  data_hora: string;
  patrimonio: string;
  modelo_toner: string;
  sede: string;
  cor: string;
  quantidade_anterior: number;
  quantidade_nova: number;
}

export const sendTonerWithdrawEmail = async (data: EmailData) => {
  try {
    console.log("Iniciando envio de e-mail de notificação:", data);
    
    // Tentativa de chamar uma Edge Function chamada 'send-toner-email'
    // Se a função não existir, o Supabase retornará um erro que capturaremos no catch
    const { data: responseData, error } = await supabase.functions.invoke("send-toner-email", {
      body: data
    });

    if (error) {
      console.error("Erro na invocação da Edge Function:", error);
      toast.error(`Falha ao disparar e-mail: ${error.message}`);
      return false;
    }

    console.log("Resposta do Resend:", responseData);
    return true;
  } catch (err: any) {
    console.error("Erro crítico no serviço de e-mail:", err);
    toast.error(`Erro no sistema de e-mail: ${err.message}`);
    return false;
  }
};
