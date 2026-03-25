import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("Usuário ou senha inválidos");
      } else {
        setError(error.message);
      }
    } else {
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-end p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Gestão Inteligente de Impressoras
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Monitore, gerencie e otimize todo o parque de impressoras da sua organização em um único painel. Coleta automatizada via SNMP, alertas em tempo real e relatórios detalhados.
          </p>
        </div>
      </div>

      {/* Right - Login */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto glow-primary">
              <Printer className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PrintWatch</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão de Impressoras</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-foreground">Entrar no sistema</h3>
              {error && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="space-y-1.5">
                <label className="text-sm text-foreground">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
