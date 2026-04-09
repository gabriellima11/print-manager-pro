import asyncio
from pysnmp.hlapi.asyncio import (
    SnmpEngine, CommunityData, UdpTransportTarget, 
    ContextData, get_cmd, ObjectType, ObjectIdentity
)

# OIDs
OID_SYS_NAME = '1.3.6.1.2.1.1.5.0'
OID_SYS_DESCR = '1.3.6.1.2.1.1.1.0'
OID_PAGE_COUNT = '1.3.6.1.2.1.43.10.2.1.4.1.1'
OID_PRINTER_STATUS = '1.3.6.1.2.1.25.3.5.1.1.1'

class Collector:
    def __init__(self, logger):
        self.logger = logger

    async def scan_range(self, network_range):
        self.logger(f"Iniciando varredura na rede: {network_range}.1-254...")
        base_ip = ".".join(network_range.split(".")[:3])
        
        semaphore = asyncio.Semaphore(50) # Coordenar acessos simultâneos
        
        async def sem_collect(ip):
            async with semaphore:
                return await self.collect_from_ip(ip)

        tasks = [sem_collect(f"{base_ip}.{i}") for i in range(1, 255)]
        
        results = await asyncio.gather(*tasks)
        printers = [p for p in results if p]
        
        self.logger(f"Varredura finalizada. Encontradas {len(printers)} impressoras.")
        return printers

    async def collect_from_ip(self, ip):
        try:
            snmp_engine = SnmpEngine()
            community_data = CommunityData('public', mpModel=1)
            udp_transport = await UdpTransportTarget.create((ip, 161), timeout=2.0, retries=0)
            
            oids = [
                ObjectType(ObjectIdentity(OID_SYS_NAME)),
                ObjectType(ObjectIdentity(OID_SYS_DESCR)),
                ObjectType(ObjectIdentity(OID_PAGE_COUNT)),
                ObjectType(ObjectIdentity(OID_PRINTER_STATUS))
            ]

            # Usando get_cmd (Nova API do pysnmp 6.0+)
            errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(
                snmp_engine, community_data, udp_transport, ContextData(), *oids
            )

            if errorIndication or errorStatus:
                return None

            printer = {
                "ip": ip,
                "nome": "",
                "modelo": "",
                "contagem_paginas": 0,
                "status": "offline",
                "toner_levels": {}
            }

            for varBind in varBinds:
                oid = str(varBind[0])
                val = varBind[1]
                
                if OID_SYS_NAME in oid:
                    printer["nome"] = str(val).strip()
                elif OID_SYS_DESCR in oid:
                    printer["modelo"] = str(val).strip()
                elif OID_PAGE_COUNT in oid:
                    try:
                        printer["contagem_paginas"] = int(val)
                    except:
                        printer["contagem_paginas"] = 0
                elif OID_PRINTER_STATUS in oid:
                    try:
                        status = int(val)
                        printer["status"] = "online" if status in [3, 4, 5] else "offline"
                    except:
                        printer["status"] = "offline"

            # Tenta pegar Toners
            await self.collect_toners(ip, printer)

            if not printer["nome"] or printer["nome"] == ip:
                printer["nome"] = f"Impressora {ip}"

            return printer
        except Exception:
            return None

    async def collect_toners(self, ip, printer):
        for i in range(1, 5):
            max_oid = f'1.3.6.1.2.1.43.11.1.1.8.1.{i}'
            cur_oid = f'1.3.6.1.2.1.43.11.1.1.9.1.{i}'
            name_oid = f'1.3.6.1.2.1.43.12.1.1.4.1.{i}'
            
            try:
                snmp_engine = SnmpEngine()
                udp_transport = await UdpTransportTarget.create((ip, 161), timeout=0.5, retries=0)
                errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(
                    snmp_engine, CommunityData('public'), udp_transport, ContextData(),
                    ObjectType(ObjectIdentity(max_oid)),
                    ObjectType(ObjectIdentity(cur_oid)),
                    ObjectType(ObjectIdentity(name_oid))
                )

                if not errorIndication and not errorStatus and len(varBinds) >= 2:
                    max_val = int(varBinds[0][1])
                    cur_val = int(varBinds[1][1])
                    name = str(varBinds[2][1]).lower() if len(varBinds) > 2 else ""
                    
                    color = self.detect_color(name, i)
                    if max_val > 0:
                        level = max(0, min(100, int((cur_val / max_val) * 100)))
                        printer["toner_levels"][color] = level
            except:
                continue

    def detect_color(self, name, index):
        if "black" in name or "pret" in name: return "black"
        if "cyan" in name or "cian" in name: return "cyan"
        if "magenta" in name: return "magenta"
        if "yellow" in name or "amar" in name: return "yellow"
        
        colors = ["black", "cyan", "magenta", "yellow"]
        return colors[index-1] if 1 <= index <= 4 else "black"
