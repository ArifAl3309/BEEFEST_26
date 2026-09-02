# -*- coding: utf-8 -*-
"""
spectra_simulator.py — Multi-Tenant Multi-Panel IoT Telemetry Simulator
Mengirim data telemetri realistis langsung ke database Supabase Cloud (tabel sensor_readings).
Mendukung multi-titik panel:
- Panel MDB (Normal)
- Panel Lab Komputer (Siklus Normal -> Waspada)
- Panel Aula / Multimedia (Siklus Normal -> Bahaya / Arc Flash)
"""

import time
import math
import random
import os
import ssl
from datetime import datetime
import urllib.request
import json

# ─────────────────────────────────────────────────────────────
# Kredensial Supabase
# ─────────────────────────────────────────────────────────────
SUPABASE_URL = "https://pgfgvcebryylizlrobhz.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZmd2Y2Vicnl5bGl6bHJvYmh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQwMDk5NSwiZXhwIjoyMTAyOTc2OTk1fQ.lEwxQc4orzMWkH8LdMAGZIHjjSdzsUGb3kJI7wpvL0Q"

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Bypass Windows SSL Verification issue
ssl_context = ssl._create_unverified_context()

def get_panels():
    """Ambil seluruh daftar panel yang ada di Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/panels?select=id,tenant_id,name,location_label"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data
    except Exception as e:
        print(f"[ERROR] Gagal mengambil data panel: {e}")
        return []

def send_reading(panel_id, tenant_id, payload):
    """Kirim data reading sensor langsung ke REST API Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/sensor_readings"
    data = {
        "panel_id": panel_id,
        "tenant_id": tenant_id,
        "voltage": payload["voltage"],
        "current_a": payload["current_a"],
        "power": payload["power"],
        "temperature_panel": payload["temperature_panel"],
        "temperature_ambient": payload["temperature_ambient"],
        "frequency": payload["frequency"],
        "power_factor": payload["power_factor"],
        "arc_detected": payload["arc_detected"],
        "status": payload["status"]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            return resp.status in (200, 201)
    except Exception as e:
        print(f"[ERROR] Gagal inject reading: {e}")
        return False

def generate_telemetry(panel_index: int, tick: int):
    """Generate nilai parameter fisika listrik realistis berdasarkan jenis titik panel"""
    t = tick * 0.2
    
    # Titik 0: Panel Utama (Selalu Normal)
    if panel_index % 3 == 0:
        status = "normal"
        arc_detected = False
        voltage = round(220.0 + random.uniform(-1.5, 1.5) + 0.5 * math.sin(t), 1)
        current_a = round(12.0 + random.uniform(0.2, 1.5) + 0.8 * math.sin(t * 0.7), 1)
        temp_panel = round(38.0 + random.uniform(0.1, 1.2), 1)
        temp_ambient = round(28.0 + random.uniform(-0.5, 0.5), 1)
    
    # Titik 1: Lab Komputer (Siklus Normal -> Waspada Beban Tinggi)
    elif panel_index % 3 == 1:
        cycle = tick % 15
        if cycle >= 10:
            status = "warning"
            arc_detected = False
            voltage = round(216.5 + random.uniform(-1.0, 1.0), 1)
            current_a = round(24.5 + random.uniform(0.5, 2.0), 1)
            temp_panel = round(56.5 + random.uniform(0.5, 2.0), 1)
            temp_ambient = round(31.0 + random.uniform(0.2, 0.8), 1)
        else:
            status = "normal"
            arc_detected = False
            voltage = round(219.0 + random.uniform(-1.0, 1.0), 1)
            current_a = round(15.0 + random.uniform(0.2, 1.2), 1)
            temp_panel = round(42.0 + random.uniform(0.2, 1.0), 1)
            temp_ambient = round(29.0 + random.uniform(-0.2, 0.5), 1)
            
    # Titik 2: Aula / Multimedia (Siklus Normal -> Kritis Arc Flash / Bahaya)
    else:
        cycle = tick % 20
        if cycle >= 16:
            status = "danger"
            arc_detected = True
            voltage = round(212.0 + random.uniform(-3.0, 1.0), 1)
            current_a = round(28.0 + random.uniform(1.0, 4.0), 1)
            temp_panel = round(68.5 + random.uniform(1.0, 3.5), 1)
            temp_ambient = round(33.0 + random.uniform(0.5, 1.2), 1)
        elif cycle >= 12:
            status = "warning"
            arc_detected = False
            voltage = round(217.0 + random.uniform(-1.5, 1.0), 1)
            current_a = round(22.0 + random.uniform(0.5, 1.5), 1)
            temp_panel = round(52.0 + random.uniform(0.5, 1.5), 1)
            temp_ambient = round(30.5 + random.uniform(0.2, 0.8), 1)
        else:
            status = "normal"
            arc_detected = False
            voltage = round(220.5 + random.uniform(-1.0, 1.0), 1)
            current_a = round(11.5 + random.uniform(0.2, 1.0), 1)
            temp_panel = round(37.5 + random.uniform(0.2, 0.8), 1)
            temp_ambient = round(28.0 + random.uniform(-0.2, 0.4), 1)

    power = round(voltage * current_a * 0.95, 1)
    frequency = round(50.0 + random.uniform(-0.15, 0.15), 1)
    power_factor = round(0.95 + random.uniform(-0.03, 0.02), 2)

    return {
        "voltage": voltage,
        "current_a": current_a,
        "power": power,
        "temperature_panel": temp_panel,
        "temperature_ambient": temp_ambient,
        "frequency": frequency,
        "power_factor": min(0.99, max(0.85, power_factor)),
        "arc_detected": arc_detected,
        "status": status
    }

def main():
    print("=================================================================")
    print("  ⚡ SPECTRA-GUARD — MULTI-PANEL IOT TELEMETRY SIMULATOR ⚡")
    print("=================================================================")
    print(f"Target Cloud Supabase: {SUPABASE_URL}")
    print("Mengambil daftar titik panel aktif...")

    panels = get_panels()
    if not panels:
        print("[PERINGATAN] Belum ada panel di database. Jalankan aplikasi web & tambahkan titik panel terlebih dahulu.")
        return

    print(f"Berhasil mendeteksi {len(panels)} Titik Panel Listrik:")
    for idx, p in enumerate(panels):
        print(f"  [{idx+1}] {p['name']} (ID: {p['id'][:8]}...)")

    print("\nMemulai pengiriman data telemetri otomatis setiap 3 detik...")
    print("Tekan Ctrl + C di terminal untuk menghentikan simulator.")
    print("-----------------------------------------------------------------")

    tick = 0
    try:
        while True:
            # Refresh list panel setiap 10 siklus jika user menambah panel baru via web
            if tick % 10 == 0:
                updated_panels = get_panels()
                if updated_panels:
                    panels = updated_panels

            now_str = datetime.now().strftime("%H:%M:%S")
            print(f"\n[{now_str}] Siklus #{tick+1} Injecting Telemetri:")

            for idx, p in enumerate(panels):
                data = generate_telemetry(idx, tick)
                status_color = "🟢 NORMAL" if data["status"] == "normal" else ("🟡 WASPADA" if data["status"] == "warning" else "🔴 BAHAYA (ARC)")
                
                success = send_reading(p["id"], p["tenant_id"], data)
                if success:
                    print(f"  ✓ {p['name'][:24].ljust(25)} : {status_color} | {data['voltage']}V | {data['current_a']}A | {data['temperature_panel']}°C")
                else:
                    print(f"  ✗ {p['name'][:24].ljust(25)} : Gagal Kirim")

            tick += 1
            time.sleep(3.0)

    except KeyboardInterrupt:
        print("\n\n[INFO] Simulator dihentikan oleh pengguna.")

if __name__ == "__main__":
    main()
