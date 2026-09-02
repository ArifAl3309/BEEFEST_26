# SPECTRA — Smart Electrical Fire Prevention & Monitoring SaaS
**Comprehensive System Architecture, Workflow, Tech Stack, & Visual UI/UX Specification**  
*Optimized for Google AI Stitch, UI Prototyping, & Technical Documentation*

---

## 1. Executive Summary & Core Concept

**SPECTRA** (*Smart Power & Electrical Thermal Risk Analytics*) adalah platform SaaS B2B Enterprise pencegahan dini kebakaran akibat anomali kelistrikan di institusi pendidikan dan fasilitas gedung bertingkat. 

Platform ini mengintegrasikan:
1. **Edge AI Hardware (ESP32-S3)**: Menganalisis spektrum frekuensi arus listrik (*Fast Fourier Transform / FFT*) dan suhu non-kontak secara lokal di busbar panel listrik.
2. **Cloud Database Real-Time (Supabase PostgreSQL)**: Sinkronisasi telemetri berkecepatan tinggi tanpa latency via PostgreSQL CDC WebSockets.
3. **Interactive Blueprint Command Center & Analytical Deep-Dive (Next.js 14 App Router)**: Menyajikan denah interaktif arsitektural gedung, modul **Discover More** (Grafik Time-Series Recharts, Spesifikasi Hardware IoT, & Log Riwayat), serta sistem *Emergency Dispatch* PLN langsung.

---

## 2. Technology Stack

### A. Frontend Architecture
- **Framework**: Next.js 14 (App Router, Server Components & Client Components).
- **Language**: TypeScript 5 (Strict typing).
- **Styling**: Tailwind CSS 3.4 + Custom Glassmorphism & Micro-animations.
- **Typography**: Google Fonts — **Hind** (`400, 500, 600, 700`).
- **Data Visualization**: Recharts (Responsive Time-Series Area & Line Charts).
- **Graphics & 3D WebGL Shader**: Three.js (Monochrome Dot Matrix WebGL Canvas Background).
- **Icons**: Lucide React.
- **State & Realtime Sync**: Hybrid dual-sync (Supabase WebSocket Push + 2.5s Auto Polling fallback).

### B. Backend & Cloud Infrastructure
- **Serverless API Routes**: Next.js 14 Route Handlers (`/api/auth/*`, `/api/panels/*`, `/api/readings/*`, `/api/readings/history`, `/api/emergency/*`).
- **Database Engine**: Supabase Cloud PostgreSQL with Row Level Security (RLS).
- **Authentication**: Supabase Auth (Cookie-based session via `@supabase/ssr`).
- **Realtime Engine**: PostgreSQL Change Data Capture (CDC) via WebSockets.

### C. Edge Hardware & Simulator
- **Microcontroller**: ESP32-S3 Dual-Core Xtensa LX7 (Edge FFT DSP).
- **Sensors**: 
  - PZEM-004T (Voltage, Current, Active Power, Energy, Frequency, Power Factor).
  - MLX90614 (Dual Infrared Non-Contact Thermal Sensor for Busbar & Ambient).
  - LoRa SX1278 (Long-Range fallback communication).
- **Telemetry Simulator**: Python multi-panel telemetry generator dengan gelombang dinamis untuk simulasi status Normal, Waspada, dan Anomali Arc Flash.

---

## 3. Detailed UI/UX Visual Layout & Page-by-Page Breakdown

### Halaman 1: Login Gateway (`/login`)
- **Visual Backdrop**:
  - Background hitam pekat `#000000` dengan canvas WebGL Three.js **Dot Matrix Shader Grid** monokrom dan radial vignette lembut.
- **Card Login**:
  - **Dimensi**: Lebar maksimal `440px`, `rounded-[32px]`, `padding: 40px`, backdrop blur 24px (`bg-[#0C1222]/90`), border `border-slate-800/90`.
  - **Header**: Logo ikon petir biru dalam kotak rounded 16px dengan teks brand *"SPECTRA"* (font-black, letter-spacing `0.25em`).
  - **Input Fields**: Email dan Password dengan ikon di sebelah kiri (`Mail`, `Lock`), border gelap, dan highlight ring biru langit saat aktif.
  - **CTA Button**: Tombol gradien biru (`from-blue-600 to-sky-600`), tinggi `48px`, font-bold, efek klik *active:scale-98*.
  - **Promoted Activation Box**: Card sekunder di bagian bawah bertuliskan *"Baru Pasang Unit SPECTRA? Aktivasi Perangkat / SIGN UP Sekolah →"* yang memiliki transisi hover glow biru.

---

### Halaman 2: Registrasi & Aktivasi Perangkat Fisik (`/signup`)
- **Visual Backdrop**:
  - WebGL Dot Matrix Shader Monokrom + radial vignette overlay.
- **Card Sign Up**:
  - **Dimensi**: Lebar maksimal `480px`, `rounded-[32px]`, `padding: 40px`, backdrop blur `bg-[#0C1222]/90`.
  - **Header**: Brand title *"SPECTRA ACTIVATION"* dengan badge cyan kecil.
  - **Activation Code Highlight Box**: Box khusus berwarna biru tua (`bg-blue-950/30 border-blue-500/30`) di bagian atas form, berisi input kode aktivasi stiker fisik ESP32 (misal: `SPEC-SMAN1BKS`) dengan font monospace kapital dan helper icon `KeyRound`.
  - **Form Fields**: Nama Lengkap PIC, Email Resmi Sekolah, Kata Sandi.
  - **CTA Button**: Tombol *"Aktivasi Perangkat & Lanjut Setup Denah →"*.
  - **Footer Link**: Tombol kembali *"Sudah memiliki akun? Masuk"*.

---

### Halaman 3: Command Center Dashboard (`/dashboard`)
Dashboard menggunakan layout **Full-Height Split Screen** (`100vh`) dengan Sidebar Statis di kanan dan Main Content Dinamis di kiri:

#### A. Header Navbar (Top Bar)
- **Dimensi**: Tinggi `64px` (`h-16`), sticky di atas dengan background `#080C16]/95`, border bawah `border-slate-800/80`.
- **Kiri**: Logo SPECTRA dengan icon petir biru menyala.
- **Kanan**:
  - Status Chip: Badge kapsul *"Telemetry Live"* dengan bulatan hijau berdenyut (*pulsing green dot*).
  - Tombol Logout: Tombol minimalis dengan ikon `LogOut` yang berubah merah saat di-hover.

#### B. Main Content View 1: Interactive Floor Plan (Default View)
- **Top Toolbar**:
  - **Profile Card (Kiri Atas Denah)**: Kapsul rounded-2xl (`bg-slate-900/90`) memuat Avatar inisial bergradien biru, Nama Operator (*William*), dan Nama Sekolah Tenant (*SMA Labschool Rawamangun*).
  - **Mode & Zoom Controls (Kanan Atas Denah)**:
    - Toggle Icon Mode: Tombol ikon kursor (`MousePointer`) untuk interaksi titik & tombol ikon tangan (`Hand`) untuk menggeser denah.
    - Zoom Controls: Tombol ikon `ZoomIn`, `ZoomOut`, dan `RotateCcw` (Reset view).
- **Canvas Denah Blueprint**:
  - **Visual Denah**: Background blueprint gelap arsitektur dengan grid terukur, nama ruangan (Lab Komputer, Server Room, Gedung Rektorat, Aula), kompas utara, dan jalur konduksi busbar.
  - **Cursor-Centered Dynamic Zoom**: Scroll mouse membesarkan/mengecilkan denah tepat berpusat di titik kursor mouse.
  - **Titik Node Panel (`PanelNode`)**:
    - Lingkaran cincin berdiameter `28px` dengan border putih dan inti berwarna sesuai status (Hijau = Normal, Kuning = Waspada, Merah = Bahaya/Arc Flash).
    - Status Bahaya memiliki efek animasi getar dan denyut merah terang (*glow pulse danger*).
    - **Draggable Node**: Titik panel dapat diklik tahan dan digeser langsung ke ruangan baru di mode kursor.
  - **Floating Detail Popover Card (`PanelDetailCard`)**:
    - **Dimensi**: Lebar `288px` (`w-72`), `rounded-[26px]`, background putih bersih (`bg-white text-slate-900`) dengan drop shadow 2xl.
    - **Top Grip Bar**: Handle bar di tepi atas untuk memindahkan/menggeser posisi popover card secara bebas di atas denah.
    - **Top Actions**: Ikon status di kiri, tombol **Hapus Merah** (`Trash2`) dan tombol Tutup (`X`) di kanan.
    - **Konten**: Nama titik panel, label gedung, list metrik singkat (Tegangan, Arus, Suhu Busbar).
    - **Action Link**: Tombol **`DISCOVER MORE →`** berwarna biru tebal yang langsung mengubah main content menjadi halaman analitik detail!

#### C. Main Content View 2: Detailed Analytics Deep-Dive (`PanelDiscoverView`)
*Muncul seketika di area main content saat tombol DISCOVER MORE ditekan, dengan layout scrollable dan sidebar tetap aktif:*
1. **Header Panel & Lokasi**:
   - Tombol kembali `[←]` (kembali ke denah), Nama Titik Panel, Label Gedung, Status Badge live, dan tombol **`[Export CSV]`**.
2. **Interactive Telemetry Time-Series Chart**:
   - Container kartu hitam rounded-3xl dengan tab switcher: **Termal & Suhu**, **Arus & Daya**, dan **Stabilitas Tegangan / FFT**.
   - Menampilkan area chart gradien dinamis 30 data sampling terakhir menggunakan Recharts.
3. **Spesifikasi Hardware SPECTRA & Sensor**:
   - Grid 3 kartu rounded-2xl:
     - **Card 1 (Modul Kontrol)**: ESP32-S3 Dual-Core Xtensa LX7 @ 240MHz, 2048 Points FFT Sampling, LoRa SX1278 fallback.
     - **Card 2 (Sensor Termal & Daya)**: MLX90614 90° FOV Non-Contact IR, PZEM-004T 80~260VAC, 100A CT Transformer.
     - **Card 3 (Storage & Sync)**: MicroSD SPI FAT32 Blackbox, DS3231 RTC Battery Backup, PostgreSQL CDC Live Cloud.
4. **Tabel Riwayat Log Kejadian**:
   - Tabel riwayat telemetri lengkap (Waktu WIB, Status, Tegangan, Arus, Daya, Suhu Busbar, Suhu Ambient, dan Indikator Anomali FFT Arc).

#### D. Sidebar Metrics & Live Hub (Kanan - Tetap Konsisten 380px)
- **Dimensi**: Lebar statis **`380px`**, border kiri `border-slate-800/80`, background `#090D17]/95`, scrollable.
- **Tampilan 1 (Daftar Titik Panel)**:
  - Display cards list dengan bulatan status cincin tebal di kiri (Merah / Kuning / Hijau / Abu-abu), tombol hapus merah, dan tombol hijau **`[+ Add Tools / Tambah Alat]`** di bawah.
- **Tampilan 2 (Detail Telemetri Titik)**:
  - Header titik, tombol merah berdenyut **`[BANTUAN DARURAT POSKO PLN]`** (jika status Bahaya), 6 kartu metrik numerik, tombol hapus merah, dan status analisis Edge FFT.

#### E. Fly Notification (Bottom Center Alert)
- **Dimensi**: Lebar maksimal `560px`, meluncur mulus dari **tengah bawah layar** saat simulator/hardware mendeteksi kondisi Waspada atau Bahaya.
- Memuat diagnosis anomali instan, icon pulsating, waktu real-time, dan tombol tutup.

---

## 4. Modal Dialogs

### Modal Add Tools (`AddToolModal`)
- Modal popup untuk menambah modul panel listrik baru.
- Input: **Activation Code Modul Baru** (uppercase monospace) & **Nama Titik Panel**.
- Tombol: *"Batal"* dan tombol hijau *"Simpan & Pasang Titik"*.

### Modal Dispatch Darurat PLN (`PlnEmergencyModal`)
- Modal darurat merah kritis saat terjadi ancaman kebakaran listrik.
- Menampilkan Nomor Tiket Dispatch Otomatis, Nama Sekolah, Alamat GPS, Titik Panel Bermasalah, Suhu Kritis, dan Arus Beban.
- Tombol aksi: *"Hubungi Posko PLN Terdekat (Call 123)"* dan konfirmasi dispatch unit posko ke lokasi.
