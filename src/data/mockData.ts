export interface Sede {
  id: string;
  nome: string;
}

export interface Printer {
  id: string;
  nome: string;
  ip: string;
  modelo: string;
  tipo: "MONO" | "COLOR";
  sede_id: string;
  status: "online" | "offline";
  page_count: number;
  toners: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
  };
  last_seen: string;
}

export interface Evento {
  id: string;
  printer_id: string;
  tipo: "offline" | "toner_baixo";
  descricao: string;
  timestamp: string;
  cor?: string;
}

export const sedes: Sede[] = [
  { id: "1", nome: "Premium Clube - Barro Preto" },
  { id: "2", nome: "Premium Clube - Grow" },
  { id: "3", nome: "Plamev" },
  { id: "4", nome: "Meep" },
  { id: "5", nome: "TaRastreado" },
  { id: "6", nome: "EssentialBPO" },
  { id: "7", nome: "SouthTI" },
  { id: "8", nome: "Pronto Assistência" },
];

export const printers: Printer[] = [
  {
    id: "1", nome: "HP Color LaserJet Pro M454", ip: "192.168.1.100", modelo: "M454dn",
    tipo: "COLOR", sede_id: "1", status: "online", page_count: 25400,
    toners: { black: 40, cyan: 65, magenta: 8, yellow: 70 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "2", nome: "HP LaserJet Pro M404", ip: "192.168.1.101", modelo: "M404n",
    tipo: "MONO", sede_id: "2", status: "online", page_count: 48200,
    toners: { black: 72 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "3", nome: "Brother HL-L3270CDW", ip: "192.168.2.102", modelo: "HL-L3270CDW",
    tipo: "COLOR", sede_id: "3", status: "online", page_count: 12300,
    toners: { black: 55, cyan: 30, magenta: 45, yellow: 5 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "4", nome: "Xerox VersaLink C400", ip: "192.168.3.50", modelo: "C400DN",
    tipo: "COLOR", sede_id: "4", status: "offline", page_count: 67800,
    toners: { black: 15, cyan: 22, magenta: 60, yellow: 38 }, last_seen: "2026-03-24T08:30:00Z",
  },
  {
    id: "5", nome: "HP LaserJet Enterprise M507", ip: "192.168.4.51", modelo: "M507dn",
    tipo: "MONO", sede_id: "5", status: "online", page_count: 102500,
    toners: { black: 9 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "6", nome: "Lexmark CS431dw", ip: "192.168.5.52", modelo: "CS431dw",
    tipo: "COLOR", sede_id: "6", status: "online", page_count: 8900,
    toners: { black: 88, cyan: 92, magenta: 85, yellow: 90 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "7", nome: "Epson WorkForce Pro WF-C5890", ip: "192.168.6.10", modelo: "WF-C5890",
    tipo: "COLOR", sede_id: "7", status: "online", page_count: 34600,
    toners: { black: 45, cyan: 7, magenta: 52, yellow: 63 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "8", nome: "Samsung ProXpress M4020", ip: "192.168.7.11", modelo: "M4020ND",
    tipo: "MONO", sede_id: "7", status: "online", page_count: 55100,
    toners: { black: 28 }, last_seen: "2026-03-24T10:00:00Z",
  },
  {
    id: "9", nome: "Canon imageCLASS MF746Cdw", ip: "192.168.7.12", modelo: "MF746Cdw",
    tipo: "COLOR", sede_id: "8", status: "offline", page_count: 19200,
    toners: { black: 3, cyan: 48, magenta: 12, yellow: 55 }, last_seen: "2026-03-23T22:15:00Z",
  },
  {
    id: "10", nome: "HP Color LaserJet MFP M480f", ip: "192.168.0.103", modelo: "M480f",
    tipo: "COLOR", sede_id: "8", status: "online", page_count: 41700,
    toners: { black: 62, cyan: 10, magenta: 73, yellow: 81 }, last_seen: "2026-03-24T10:00:00Z",
  },
];

export const eventos: Evento[] = [
  { id: "1", printer_id: "1", tipo: "toner_baixo", descricao: "Magenta abaixo de 10%", timestamp: "2026-03-24T09:45:00Z", cor: "magenta" },
  { id: "2", printer_id: "3", tipo: "toner_baixo", descricao: "Amarelo abaixo de 10%", timestamp: "2026-03-24T09:30:00Z", cor: "yellow" },
  { id: "3", printer_id: "5", tipo: "toner_baixo", descricao: "Preto abaixo de 10%", timestamp: "2026-03-24T09:15:00Z", cor: "black" },
  { id: "4", printer_id: "4", tipo: "offline", descricao: "Impressora offline", timestamp: "2026-03-24T08:30:00Z" },
  { id: "5", printer_id: "7", tipo: "toner_baixo", descricao: "Ciano abaixo de 10%", timestamp: "2026-03-24T08:00:00Z", cor: "cyan" },
  { id: "6", printer_id: "9", tipo: "offline", descricao: "Impressora offline", timestamp: "2026-03-23T22:15:00Z" },
  { id: "7", printer_id: "9", tipo: "toner_baixo", descricao: "Preto abaixo de 10%", timestamp: "2026-03-23T22:00:00Z", cor: "black" },
  { id: "8", printer_id: "10", tipo: "toner_baixo", descricao: "Ciano abaixo de 10%", timestamp: "2026-03-24T07:00:00Z", cor: "cyan" },
];

export const usageByMonth = [
  { month: "Out", pages: 18500 },
  { month: "Nov", pages: 21200 },
  { month: "Dez", pages: 19800 },
  { month: "Jan", pages: 22400 },
  { month: "Fev", pages: 20100 },
  { month: "Mar", pages: 24300 },
];

export const usageBySede = [
  { sede: "Curitiba", pages: 127600 },
  { sede: "São Paulo", pages: 179200 },
  { sede: "Florianópolis", pages: 108900 },
];

export function getSedeNome(sedeId: string): string {
  return sedes.find(s => s.id === sedeId)?.nome ?? "Desconhecida";
}

export function getCriticalToners(printer: Printer): { cor: string; nivel: number }[] {
  const critical: { cor: string; nivel: number }[] = [];
  if (printer.toners.black <= 10) critical.push({ cor: "black", nivel: printer.toners.black });
  if (printer.toners.cyan !== undefined && printer.toners.cyan <= 10) critical.push({ cor: "cyan", nivel: printer.toners.cyan });
  if (printer.toners.magenta !== undefined && printer.toners.magenta <= 10) critical.push({ cor: "magenta", nivel: printer.toners.magenta });
  if (printer.toners.yellow !== undefined && printer.toners.yellow <= 10) critical.push({ cor: "yellow", nivel: printer.toners.yellow });
  return critical;
}
