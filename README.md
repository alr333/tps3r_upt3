# TPS3R Site Intelligence

Prototipe frontend lokal untuk mendukung penentuan prioritas lokasi TPS3R baru di Kabupaten Bogor menggunakan TOPSIS.

## Persyaratan

- Node.js 18 atau lebih baru
- npm

## Menjalankan aplikasi

```powershell
npm install
npm run dev
```

## Perintah build

```powershell
npm run build
npm run preview
```

## Struktur aplikasi

- `src/App.jsx`: aplikasi, navigasi, dan pemilihan halaman
- `src/components/`: halaman, komponen bersama, dashboard, analisis, dan ranking
- `src/data/topsis.js`: engine TOPSIS murni dan transparan
- `src/data/dataModel.js`: normalisasi dan validasi model data
- `src/data/localStorage.js`: persistence data dan snapshot analisis
- `src/data/seedAlternatives.js`: kandidat dan kriteria simulasi awal
- `src/styles.css`: token visual, komponen, dan breakpoint responsif

## Alur penggunaan

1. Kelola kandidat pada halaman **Kandidat Lokasi**.
2. Isi C1–C5 pada **Penilaian Kriteria**.
3. Pastikan bobot C1–C5 berjumlah 1.00 pada **Pengaturan Bobot**.
4. Jalankan TOPSIS secara eksplisit pada **Analisis TOPSIS**.
5. Tinjau ranking, grafik, dan detail perhitungan pada **Hasil & Ranking**.
6. Unduh laporan Excel atau gunakan tombol **PDF** untuk membuka dialog cetak dan simpan sebagai PDF.

## Pengujian

```powershell
npm test
npm run build
npm run preview
```

## Peta edit cepat

| Bagian yang diedit | File | Command |
|---|---|---|
| Warna, font, jarak, CSS | `src/styles.css` | `npm.cmd run dev` |
| Menu dan pemilihan halaman | `src/App.jsx` | `npm.cmd run dev` |
| Data kandidat dan bobot contoh | `src/data/seedAlternatives.js` | `npm.cmd test` |
| Validasi alternatif dan bobot | `src/data/dataModel.js` | `npm.cmd test` |
| Rumus TOPSIS | `src/data/topsis.js` | `npm.cmd test` |
| LocalStorage dan snapshot | `src/data/localStorage.js` | `npm.cmd test` |
| CRUD kandidat | `src/components/CandidatePage.jsx` | `npm.cmd run dev` |
| Input C1–C5 | `src/components/CriteriaPage.jsx` | `npm.cmd run dev` |
| Pengaturan bobot | `src/components/WeightPage.jsx` | `npm.cmd run dev` |
| Dashboard | `src/components/DashboardPage.jsx` | `npm.cmd run dev` |
| Analisis | `src/components/AnalysisPage.jsx` | `npm.cmd run dev` |
| Ranking dan laporan | `src/components/ResultsPage.jsx` | `npm.cmd run dev` |
| Sheet Excel | `src/data/reportExport.js` | `npm.cmd test` |
| Teks rekomendasi | `src/data/recommendation.js` | `npm.cmd test` |
| Build/chunk | `vite.config.js` | `npm.cmd run build` |

## Command Windows yang paling sering dipakai

```powershell
Set-Location "e:\TPS3R_SOT_Complete_Phase1-4\TPS3R_SOT_Complete"
npm.cmd install
npm.cmd run dev
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

## Batas MVP

- Frontend-only dengan data lokal/mock.
- Belum ada backend, autentikasi, database, GIS, API eksternal, atau fitur ekspor.
- Semua data kandidat adalah **DATA SIMULASI** dan belum tervalidasi lapangan.
- Kriteria C3 adalah kepadatan pemukiman sekitar pada skala 1–5 sebagai cost. Rubrik penilaiannya harus ditampilkan konsisten pada tahap implementasi penilaian kriteria.
