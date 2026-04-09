import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PrinterWithToners, Sede } from "@/hooks/usePrinterData";

const BRAND_COLOR: [number, number, number] = [26, 188, 156]; // #1abc9c
const SECONDARY_COLOR: [number, number, number] = [44, 62, 80]; // #2c3e50

export function exportRelatorioGeral(printers: PrinterWithToners[], sedeStats: any[]) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString("pt-BR");

  // Header
  doc.setFillColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("RELATÓRIO GERAL DA FROTA", 15, 20);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${timestamp}`, 15, 30);
  doc.text("Print Manager Pro - Gestão de Impressão", 15, 35);

  // Summary Cards
  const totalPages = printers.reduce((sum, p) => sum + (p.page_count || 0), 0);
  const onlineCount = printers.filter((p) => p.status === "online").length;
  
  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.setFontSize(14);
  doc.text("Resumo de Atividades", 15, 55);
  
  autoTable(doc, {
    startY: 60,
    head: [["Métrica", "Valor"]],
    body: [
      ["Total de Impressoras", printers.length.toString()],
      ["Total de Páginas Impressas", totalPages.toLocaleString("pt-BR")],
      ["Dispositivos Online", onlineCount.toString()],
      ["Dispositivos Offline", (printers.length - onlineCount).toString()],
    ],
    theme: "striped",
    headStyles: { fillColor: SECONDARY_COLOR },
  });

  // Sede Table
  const lastY = (doc as any).lastAutoTable?.finalY || 60;
  doc.setFontSize(14);
  doc.text("Distribuição por Sede", 15, lastY + 15);

  autoTable(doc, {
    startY: lastY + 20,
    head: [["Sede", "Impressoras", "Total Páginas", "Disponibilidade"]],
    body: sedeStats.map(s => [
      s.nome,
      s.printerCount.toString(),
      s.totalPages.toLocaleString("pt-BR"),
      s.offlineCount === 0 ? "100%" : `${Math.round(((s.printerCount - s.offlineCount) / s.printerCount) * 100)}%`
    ]),
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR },
  });

  doc.save(`relatorio_geral_${new Date().getTime()}.pdf`);
}

export function exportRelatorioSedes(sedeStats: any[]) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString("pt-BR");

  doc.setFillColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("RELATÓRIO DETALHADO POR SEDE", 15, 15);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${timestamp}`, 15, 23);

  let currentY = 40;

  sedeStats.forEach((s) => {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
    doc.setFontSize(14);
    doc.text(`${s.nome} (${s.printerCount} impressoras)`, 15, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Impressora", "Patrimônio", "IP", "Contador", "Status"]],
      body: s.printers.map((p: any) => [
        p.nome,
        p.patrimonio || "-",
        p.ip,
        p.page_count.toLocaleString("pt-BR"),
        p.status.toUpperCase()
      ]),
      theme: "striped",
      headStyles: { fillColor: SECONDARY_COLOR },
      margin: { left: 15, right: 15 },
    });

    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  });

  doc.save(`relatorio_sedes_${new Date().getTime()}.pdf`);
}

export function exportRelatorioIndividual(printers: PrinterWithToners[], sedes: Sede[]) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString("pt-BR");

  doc.setFillColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("LISTAGEM INDIVIDUAL DE IMPRESSORAS", 15, 15);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${timestamp}`, 15, 23);

  autoTable(doc, {
    startY: 40,
    head: [["Impressora", "Sede", "Patrimônio", "IP", "Páginas", "Toner K"]],
    body: printers.map((p) => [
      p.nome,
      sedes.find(s => s.id === p.sede_id)?.nome || "-",
      p.patrimonio || "-",
      p.ip,
      p.page_count.toLocaleString("pt-BR"),
      `${p.toners.black}%`
    ]),
    theme: "grid",
    headStyles: { fillColor: SECONDARY_COLOR },
    styles: { fontSize: 8 },
  });

  doc.save(`relatorio_individual_${new Date().getTime()}.pdf`);
}

export function exportRelatorioUnico(printer: PrinterWithToners, sedeNome: string) {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString("pt-BR");

  doc.setFillColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2]);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("RELATÓRIO INDIVIDUAL DE DISPOSITIVO", 15, 20);
  doc.setFontSize(10);
  doc.text(`Impressora: ${printer.nome}`, 15, 28);
  doc.text(`Sede: ${sedeNome} | Gerado em: ${timestamp}`, 15, 34);

  doc.setTextColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.setFontSize(14);
  doc.text("Especificações Técnicas", 15, 55);

  autoTable(doc, {
    startY: 60,
    head: [["Campo", "Informação"]],
    body: [
      ["Nome", printer.nome],
      ["Patrimônio", printer.patrimonio || "Não Informado"],
      ["Endereço IP", printer.ip],
      ["Modelo", printer.modelo || "Não Informado"],
      ["Endereço MAC", printer.mac_address || "Não Informado"],
      ["Tipo", printer.tipo === "MONO" ? "Monocromática" : "Colorida"],
      ["Sede", sedeNome],
    ],
    theme: "striped",
    headStyles: { fillColor: SECONDARY_COLOR },
  });

  doc.setFontSize(14);
  doc.text("Leituras Atuais", 15, ((doc as any).lastAutoTable?.finalY || 60) + 15);

  autoTable(doc, {
    startY: ((doc as any).lastAutoTable?.finalY || 60) + 20,
    head: [["Métrica", "Valor"]],
    body: [
      ["Contador Total de Páginas", printer.page_count.toLocaleString("pt-BR")],
      ["Status de Rede", printer.status.toUpperCase()],
      ["Última Visualização", printer.last_seen ? new Date(printer.last_seen).toLocaleString("pt-BR") : "Nunca"],
      ["Nível de Toner (Preto)", `${printer.toners.black}%`],
      ...(printer.tipo === "COLOR" ? [
        ["Nível de Toner (Ciano)", `${printer.toners.cyan}%`],
        ["Nível de Toner (Magenta)", `${printer.toners.magenta}%`],
        ["Nível de Toner (Amarelo)", `${printer.toners.yellow}%`],
      ] : []),
    ],
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR },
  });

  doc.save(`relatorio_${printer.nome.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
}
