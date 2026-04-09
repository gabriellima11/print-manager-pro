import customtkinter as ctk
import threading
import asyncio
import time
import os
from PIL import Image
from client import fetch_sedes, fetch_agente_by_sede, send_to_backend_with_token
from collector import Collector

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class PrinterCard(ctk.CTkFrame):
    def __init__(self, master, printer, icon_image=None, **kwargs):
        super().__init__(master, fg_color="#2b2b2b", corner_radius=10, border_width=1, border_color="#3d3d3d", width=180, **kwargs)
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_propagate(False)
        self.configure(height=160)
        
        # Icone
        if icon_image:
            self.icon_label = ctk.CTkLabel(self, text="", image=icon_image)
            self.icon_label.grid(row=0, column=0, pady=(10, 0))
        
        # Nome (Trunca se for muito grande)
        nome = printer["nome"]
        if len(nome) > 18: nome = nome[:15] + "..."
        self.name_label = ctk.CTkLabel(self, text=nome, font=ctk.CTkFont(size=13, weight="bold"))
        self.name_label.grid(row=1, column=0, padx=10, pady=(5, 0))
        
        # IP
        self.ip_label = ctk.CTkLabel(self, text=f"IP: {printer['ip']}", font=ctk.CTkFont(size=11), text_color="#aaaaaa")
        self.ip_label.grid(row=2, column=0, padx=10, pady=(0, 5))
        
        # Status Badge
        status = printer.get("status", "offline").lower()
        if status == "online":
            color = "#2ecc71"
            text = "Online"
        elif "espera" in status or "standby" in status:
            color = "#f1c40f"
            text = "Em Espera"
        elif "imprimindo" in status or "printing" in status:
            color = "#3498db"
            text = "Imprimindo"
        else:
            color = "#e74c3c"
            text = "Offline"
        
        self.status_badge = ctk.CTkLabel(
            self, text=text, fg_color=color, text_color="white", 
            corner_radius=10, width=100, font=ctk.CTkFont(size=10, weight="bold")
        )
        self.status_badge.grid(row=3, column=0, padx=10, pady=(0, 10))

class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Print Manager Pro")

        # Em vez de 900x700 fixo, definimos um mínimo e deixamos o layout se ajustar
        self.minsize(900, 650)
        
        # Carregar Icone
        self.printer_icon = None
        try:
            asset_path = os.path.join(os.path.dirname(__file__), "assets", "printer.png")
            if os.path.exists(asset_path):
                img = Image.open(asset_path)
                self.printer_icon = ctk.CTkImage(light_image=img, dark_image=img, size=(40, 40))
        except Exception as e:
            print(f"Erro ao carregar icone: {e}")

        # Layout principal
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(3, weight=1)

        # 1. Header
        self.header_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.header_frame.grid(row=0, column=0, padx=30, pady=(30, 10), sticky="ew")
        
        if self.printer_icon:
            self.logo_label = ctk.CTkLabel(self.header_frame, text="", image=self.printer_icon)
            self.logo_label.pack(side="left", padx=(0, 10))

        self.title_label = ctk.CTkLabel(self.header_frame, text="Monitoramento de Impressoras", 
                                       font=ctk.CTkFont(size=28, weight="bold"))
        self.title_label.pack(side="left")

        # 2. Configurações de Sede
        self.config_group = ctk.CTkFrame(self, fg_color="transparent")
        self.config_group.grid(row=1, column=0, padx=30, pady=10, sticky="ew")
        self.config_group.grid_columnconfigure(0, weight=1)
        
        self.config_label = ctk.CTkLabel(self.config_group, text="Configurações de Sede", font=ctk.CTkFont(size=12, weight="bold"), text_color="#777777")
        self.config_label.pack(anchor="w", padx=5)
        
        self.config_container = ctk.CTkFrame(self.config_group, border_width=1, border_color="#3d3d3d", fg_color="#1e1e1e")
        self.config_container.pack(fill="x", pady=5)
        
        self.sede_select = ctk.CTkOptionMenu(self.config_container, values=["Carregando sedes..."], 
                                           width=400, height=35, command=self.on_sede_change)
        self.sede_select.pack(side="left", padx=20, pady=20)
        
        self.start_button = ctk.CTkButton(self.config_container, text="▶ Iniciar Monitoramento", 
                                         width=220, height=40, font=ctk.CTkFont(weight="bold"),
                                         fg_color="#1abc9c", hover_color="#16a085",
                                         command=self.start_monitoring)
        self.start_button.pack(side="right", padx=20, pady=20)

        # 3. Visualização de Impressoras
        self.view_group = ctk.CTkFrame(self, fg_color="transparent")
        self.view_group.grid(row=2, column=0, padx=30, pady=10, sticky="ew")
        
        self.view_label = ctk.CTkLabel(self.view_group, text="Visualização de Impressoras", font=ctk.CTkFont(size=12, weight="bold"), text_color="#777777")
        self.view_label.pack(anchor="w", padx=5)
        
        self.scroll_view = ctk.CTkScrollableFrame(self.view_group, orientation="horizontal", height=180, 
                                                border_width=1, border_color="#3d3d3d", fg_color="#1e1e1e")
        self.scroll_view.pack(fill="x", pady=5)
        
        self.printer_cards = []

        # 4. Logs
        self.log_group = ctk.CTkFrame(self, fg_color="transparent")
        self.log_group.grid(row=3, column=0, padx=30, pady=(10, 30), sticky="nsew")
        self.log_group.grid_rowconfigure(1, weight=1)
        self.log_group.grid_columnconfigure(0, weight=1)
        
        self.log_label = ctk.CTkLabel(self.log_group, text="Log de Atividades do Agente", font=ctk.CTkFont(size=12, weight="bold"), text_color="#777777")
        self.log_label.grid(row=0, column=0, sticky="w", padx=5)
        
        self.log_area = ctk.CTkTextbox(self.log_group, fg_color="#121212", border_width=1, border_color="#3d3d3d", 
                                       text_color="#3498db", font=("Consolas", 12))
        self.log_area.grid(row=1, column=0, sticky="nsew", pady=5)
        
        self.append_log("Agente iniciado. Verificando configurações...")
        
        # Inicialização
        self.sede_all = []
        self.selected_sede = None
        threading.Thread(target=self.load_sedes, daemon=True).start()

    def append_log(self, msg, color="#dfdfdf"):
        timestamp = time.strftime("%H:%M:%S")
        self.log_area.insert("end", f"[{timestamp}] {msg}\n")
        self.log_area.see("end")

    def load_sedes(self):
        try:
            self.sede_all = fetch_sedes()
            names = [s["nome"] for s in self.sede_all]
            self.sede_select.configure(values=names)
            if names:
                self.sede_select.set(names[0])
                self.on_sede_change(names[0])
            self.append_log("Sedes carregadas com sucesso.")
        except Exception as e:
            self.append_log(f"Erro ao carregar sedes: {e}", "#e74c3c")

    def on_sede_change(self, name):
        for s in self.sede_all:
            if s["nome"] == name:
                self.selected_sede = s
                self.append_log(f"Sede selecionada: {s['nome']} (Range: {s['network_range']})")
                break

    def update_printer_list(self, printers):
        for card in self.printer_cards:
            card.destroy()
        self.printer_cards = []
        
        for i, printer in enumerate(printers):
            card = PrinterCard(self.scroll_view, printer, icon_image=self.printer_icon)
            card.grid(row=0, column=i, padx=10, pady=10)
            self.printer_cards.append(card)

    def start_monitoring(self):
        if not self.selected_sede:
            self.append_log("ERRO: Nenhuma sede selecionada!")
            return

        self.start_button.configure(state="disabled", text="◉ Monitorando...")
        self.sede_select.configure(state="disabled")
        threading.Thread(target=self.run_collector_loop, daemon=True).start()

    def run_collector_loop(self):
        try:
            agente = fetch_agente_by_sede(self.selected_sede["id"])
            if not agente:
                self.append_log("Erro: Agente não encontrado no banco.")
                return
            
            token = agente["token"]
            network_range = self.selected_sede["network_range"]
            interval_min = int(os.getenv("COLLECT_INTERVAL_MIN", 5))
            
            collector = Collector(self.append_log)
            
            while True:
                self.append_log(f"Iniciando varredura na rede {network_range}...")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                printers = loop.run_until_complete(collector.scan_range(network_range))
                
                self.after(0, lambda p=printers: self.update_printer_list(p))
                
                self.append_log(f"Varredura concluída. Enviando dados de {len(printers)} impressoras...")
                send_to_backend_with_token(printers, token, self.selected_sede["id"])
                
                time.sleep(interval_min * 60)
                
        except Exception as e:
            self.append_log(f"Erro no loop de coleta: {e}")
            self.after(0, lambda: self.start_button.configure(state="normal", text="▶ Iniciar Monitoramento"))
