import os
import requests
import urllib3
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SKIP_TLS_VERIFY = os.getenv("SKIP_TLS_VERIFY", "false").lower() == "true"

if SKIP_TLS_VERIFY:
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def fetch_sedes():
    url = f"{SUPABASE_URL}/rest/v1/sedes?select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    response = requests.get(url, headers=headers, verify=not SKIP_TLS_VERIFY)
    response.raise_for_status()
    return response.json()

def fetch_agente_by_sede(sede_id):
    url = f"{SUPABASE_URL}/rest/v1/agentes?sede_id=eq.{sede_id}&select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    response = requests.get(url, headers=headers, verify=not SKIP_TLS_VERIFY)
    response.raise_for_status()
    data = response.json()
    return data[0] if data else None

def send_to_backend_with_token(printers, token, sede_id):
    url = f"{SUPABASE_URL}/rest/v1/impressoras?on_conflict=ip,sede_id"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    # Formatar dados conforme esperado pelo backend
    payload = []
    for p in printers:
        payload.append({
            "ip": p["ip"],
            "nome": p["nome"],
            "modelo": p.get("modelo", "Desconhecido"),
            "sede_id": sede_id,
            "page_count": p.get("contagem_paginas", 0),
            "status": p.get("status", "offline"),
            "last_seen": "now()",
            "tipo": "MONO" # Default for now
        })
    
    response = requests.post(url, headers=headers, json=payload, verify=not SKIP_TLS_VERIFY)
    response.raise_for_status()
    return response
