# Rencana Integrasi Google Maps API (Onboarding & Dashboard View)

Dokumen ini menguraikan arsitektur dan langkah implementasi integrasi **Google Maps Platform** ke dalam aplikasi **SPECTRA**.

---

## 1. Lingkup Integrasi (Scope)

### A. Setup Onboarding Sekolah (`/onboarding`)
- **Places Autocomplete**: Input alamat lengkap sekolah terhubung dengan Google Places Autocomplete API.
- **Auto Geocoding (Latitude & Longitude)**: Saat pengguna memilih salah satu saran alamat dari Google, koordinat GPS (Latitude & Longitude) otomatis terisi secara instan tanpa perlu diketik manual.
- **Interactive Mini Map Picker**: Menampilkan preview titik pin lokasi sekolah di Google Maps dengan marker yang dapat disesuaikan.

### B. Command Center Dashboard (`/dashboard`)
- **Toggle View Mode**: Menyediakan tombol switcher di header denah untuk beralih antara:
  1. **Blueprint Mode (Indoor)**: Denah arsitektur sekat ruangan & jalur busbar.
  2. **Google Maps Satelit / Dark Vector Mode (Outdoor)**: Peta satelit Google Maps terintegrasi yang difokuskan pada koordinat sekolah dengan custom dark map styling.
- **Graceful Fallback**: Jika Google Maps API Key belum diisi oleh user di file `.env.local` (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`), sistem otomatis menyajikan antarmuka visual interaktif fallback tanpa error/crash.

---

## 2. Dependensi & API Key Setup

1. Library: `@react-google-maps/api` atau vanilla Google Maps JavaScript API Loader.
2. Environment Variable:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
3. API yang Diaktifkan di Google Cloud Console:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
