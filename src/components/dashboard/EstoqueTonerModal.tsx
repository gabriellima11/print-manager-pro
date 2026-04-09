import { useState, useEffect } from "react";
import { EstoqueToner, useAddEstoqueToner, useUpdateEstoqueToner } from "@/hooks/useEstoqueToners";
import { useSedes } from "@/hooks/usePrinterData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Plus, Minus, ArrowRight } from "lucide-react";
import { sendTonerWithdrawEmail } from "@/utils/emailService";
import { getSedeNome } from "@/hooks/usePrinterData";

interface EstoqueTonerModalProps {
  isOpen: boolean;
  onClose: () => void;
  toner: EstoqueToner | null;
}

export default function EstoqueTonerModal({ isOpen, onClose, toner }: EstoqueTonerModalProps) {
  const { data: sedes = [] } = useSedes();
  const addToner = useAddEstoqueToner();
  const updateToner = useUpdateEstoqueToner();
  
  const [formData, setFormData] = useState({
    modelo: "",
    cor: "BLACK",
    impressora_compativel: "",
    quantidade: 0,
    quantidade_minima: 5,
    sede_id: "",
  });

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [printerPatrimonio, setPrinterPatrimonio] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsWithdrawing(false);
      setPrinterPatrimonio("");
      if (toner) {
        setFormData({
          modelo: toner.modelo,
          cor: toner.cor,
          impressora_compativel: toner.impressora_compativel,
          quantidade: toner.quantidade,
          quantidade_minima: toner.quantidade_minima,
          sede_id: toner.sede_id,
        });
      } else {
        setFormData({
          modelo: "",
          cor: "BLACK",
          impressora_compativel: "",
          quantidade: 0,
          quantidade_minima: 2,
          sede_id: sedes[0]?.id || "",
        });
      }
    }
  }, [isOpen, toner, sedes]);

  const handleSave = async () => {
    if (!formData.modelo || !formData.impressora_compativel || !formData.sede_id) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (toner) {
        // Detect withdrawal
        if (formData.quantidade < toner.quantidade && !isWithdrawing) {
          setIsWithdrawing(true);
          return;
        }

        if (isWithdrawing && !printerPatrimonio) {
          toast.error("Informe o patrimônio da impressora");
          return;
        }

        setIsSendingEmail(true);
        await updateToner.mutateAsync({
          id: toner.id,
          ...formData,
        });

        if (isWithdrawing) {
          console.log("Iniciando processo de notificação de retirada...");
          const sedeNome = getSedeNome(sedes, formData.sede_id);
          await sendTonerWithdrawEmail({
            data_hora: new Date().toLocaleString("pt-BR"),
            patrimonio: printerPatrimonio,
            modelo_toner: formData.modelo,
            sede: sedeNome,
            cor: formData.cor,
            quantidade_anterior: toner.quantidade,
            quantidade_nova: formData.quantidade,
          });
          toast.success("Retirada registrada e e-mail enviado!");
        } else {
          toast.success("Toner atualizado com sucesso!");
        }
      } else {
        await addToner.mutateAsync(formData);
        toast.success("Toner adicionado com sucesso!");
      }
      onClose();
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const isPending = addToner.isPending || updateToner.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{toner ? "Editar Toner no Estoque" : "Adicionar Toner ao Estoque"}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid gap-4 py-4">
            {!isWithdrawing ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sede da Instalação *</label>
                  <select
                    value={formData.sede_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, sede_id: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" disabled>Selecione uma sede</option>
                    {sedes.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo do Toner *</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                    placeholder="Ex: CF283A"
                    className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor *</label>
                  <select
                    value={formData.cor}
                    onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="BLACK">Preto (Black)</option>
                    <option value="CYAN">Ciano (Cyan)</option>
                    <option value="MAGENTA">Magenta (Magenta)</option>
                    <option value="YELLOW">Amarelo (Yellow)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Impressoras Compatíveis *</label>
                  <input
                    type="text"
                    value={formData.impressora_compativel}
                    onChange={(e) => setFormData(prev => ({ ...prev, impressora_compativel: e.target.value }))}
                    placeholder="Ex: HP M125, M127..."
                    className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Qtd em Estoque</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, quantidade: Math.max(0, prev.quantidade - 1) }))}
                        className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantidade}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantidade: Math.max(0, Number(e.target.value)) }))}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }))}
                        className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estoque Mínimo</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, quantidade_minima: Math.max(0, prev.quantidade_minima - 1) }))}
                        className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantidade_minima}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantidade_minima: Math.max(0, Number(e.target.value)) }))}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, quantidade_minima: prev.quantidade_minima + 1 }))}
                        className="p-2 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Confirmar Retirada</h4>
                    <p className="text-xs text-muted-foreground">Você está removendo {toner!.quantidade - formData.quantidade} toner(s) do estoque.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patrimônio da Impressora Destino *</label>
                  <input
                    type="text"
                    autoFocus
                    value={printerPatrimonio}
                    onChange={(e) => setPrinterPatrimonio(e.target.value)}
                    placeholder="Ex: PAT-1234..."
                    className="w-full px-3 py-2 rounded-lg text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-[10px] text-muted-foreground">Esta informação será enviada por e-mail para registro.</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <button
            onClick={onClose}
            disabled={isPending || isSendingEmail}
            className="bg-secondary text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {isWithdrawing ? "Voltar" : "Cancelar"}
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || isSendingEmail}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-w-[100px]"
          >
            {isPending || isSendingEmail ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              isWithdrawing ? "Confirmar Retirada" : "Salvar"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
