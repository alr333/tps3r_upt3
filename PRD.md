# PRD — Sistem Penunjang Keputusan Penentuan Lokasi Pembangunan TPS3R Baru

**Unit:** UPT III Pengelolaan Sampah Wilayah III Ciawi — Dinas Lingkungan Hidup Kabupaten Bogor  
**Versi:** 0.1 — Draft Phase 1  
**Status:** Phase 1–3 disetujui; implementasi MVP selesai melalui M7 dan masuk final QA  
**Metode:** TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)


## 1. Ringkasan
Aplikasi web SPK membantu pengguna membandingkan alternatif kecamatan/desa kandidat pembangunan TPS3R baru di Kabupaten Bogor menggunakan lima kriteria terukur, bobot kriteria, dan metode TOPSIS. Sistem menyajikan hasil peringkat, nilai preferensi, dan rincian perhitungan untuk mendukung—bukan menggantikan—keputusan pengambil kebijakan.

## 2. Problem Statement
Penentuan lokasi fasilitas TPS3R perlu mempertimbangkan kebutuhan pengelolaan sampah, kesiapan lahan, dampak terhadap permukiman, akses kendaraan pengangkut, dan kesiapan masyarakat secara bersamaan. Penilaian manual berisiko sulit dibandingkan, tidak konsisten, atau kurang transparan.

## 3. Tujuan
- Membandingkan alternatif lokasi secara konsisten berdasarkan lima kriteria.
- Menghasilkan peringkat prioritas menggunakan TOPSIS.
- Menyediakan transparansi nilai input, bobot, proses kalkulasi, dan hasil.
- Memudahkan pembaruan kandidat serta data penilaian.

## 4. Pengguna & Peran
- **Admin/Operator:** mengelola alternatif, input nilai kriteria, dan konfigurasi bobot.
- **Pimpinan/Viewer:** melihat dashboard, hasil ranking, dan rincian analisis.
Phase 1 tidak menetapkan implementasi autentikasi atau pembagian hak akses teknis.

## 5. Ruang Lingkup MVP
### In scope
1. Dashboard ringkasan analisis.
2. CRUD alternatif kecamatan/desa kandidat (data lokal/mock pada MVP).
3. Form penilaian lima kriteria untuk setiap alternatif.
4. Konfigurasi bobot kriteria dengan validasi total bobot = 1.00.
5. Perhitungan TOPSIS: matriks keputusan, normalisasi, matriks terbobot, solusi ideal positif/negatif, jarak setiap alternatif ke solusi ideal, dan nilai preferensi.
6. Ranking alternatif, visualisasi perbandingan, serta detail perhitungan.
7. Validasi data dan empty/error states.
8. Ekspor laporan Excel dan cetak/simpan laporan sebagai PDF dari halaman hasil.
### Out of scope
GIS/pemetaan spasial interaktif, data sensor/IoT, prediksi AI/ML, integrasi API eksternal, pengadaan/administrasi lahan, workflow persetujuan resmi, backend/database production, autentikasi production, dan fitur lain yang tidak disebutkan di MVP.

## 6. Alternatif
Alternatif berupa beberapa kecamatan atau desa kandidat di Kabupaten Bogor. Pengguna dapat menambah, mengubah, dan menghapus alternatif; setiap alternatif memiliki nama wilayah, nama kecamatan induk (jika desa), catatan opsional, dan lima nilai kriteria.

## 7. Kriteria & Bobot
| Kode | Kriteria | Bobot | Tipe | Unit/Skala MVP |
|---|---|---:|---|---|
| C1 | Volume sampah belum terlayani | 0.30 | Benefit | ton/hari |
| C2 | Ketersediaan luas lahan | 0.25 | Benefit | m² |
| C3 | Kepadatan pemukiman sekitar | 0.20 | Cost | Skor 1–5 (definisi skala wajib disediakan UI) |
| C4 | Aksesibilitas jalan truk | 0.15 | Benefit | Skor 1–5 (rubrik penilaian wajib disediakan UI) |
| C5 | Partisipasi & kesiapan masyarakat | 0.10 | Benefit | Skor 1–5 (rubrik penilaian wajib disediakan UI) |
**Total bobot: 1.00.** C3 adalah cost: nilai lebih tinggi berarti kondisi lebih tidak diinginkan. Rubrik skor 1–5 untuk C3–C5 harus ditampilkan konsisten agar input dapat dibandingkan.

## 8. TOPSIS — Alur Kalkulasi
1. Validasi data alternatif dan bobot; pastikan alternatif cukup dan tidak ada input yang hilang/invalid.
2. Bentuk matriks keputusan X.
3. Normalisasi matriks dengan normalisasi vektor: rᵢⱼ = xᵢⱼ / √Σᵢ xᵢⱼ².
4. Matriks terbobot: vᵢⱼ = wⱼ × rᵢⱼ.
5. Tentukan solusi ideal positif (A+) dan negatif (A−), dengan pemilihan nilai mengikuti benefit/cost.
6. Hitung jarak Euclidean alternatif terhadap A+ dan A−.
7. Hitung nilai preferensi: Cᵢ = Dᵢ− / (Dᵢ+ + Dᵢ−).
8. Urutkan nilai Cᵢ secara menurun. Nilai lebih tinggi menjadi alternatif lebih direkomendasikan dalam model.
Sistem harus menampilkan tahapan perhitungan yang dapat ditelusuri dan menangani kasus pembagi nol atau kolom bernilai sama secara aman.

## 9. Functional Requirements
- **FR-01 Dashboard:** ringkasan jumlah alternatif, lokasi peringkat pertama, nilai preferensi tertinggi, dan ringkasan visual.
- **FR-02 Alternatif:** tambah/edit/hapus alternatif kandidat; validasi nama dan data.
- **FR-03 Input kriteria:** input C1–C5; tampilkan unit, benefit/cost, dan rubrik skor.
- **FR-04 Bobot:** tampilkan bobot default; izinkan edit pada MVP; validasi bobot nonnegatif dan total tepat 1.00 (toleransi tampilan/pembulatan ditentukan implementasi).
- **FR-05 Analisis TOPSIS:** jalankan kalkulasi setelah data valid; tampilkan langkah perhitungan.
- **FR-06 Ranking:** tampilkan urutan, nilai preferensi, dan ringkasan kriteria; ranking diperbarui ketika data berubah.
- **FR-07 Detail:** pengguna dapat melihat matriks input, normalisasi, bobot, ideal positif/negatif, jarak, dan nilai preferensi.
- **FR-08 State UI:** loading (jika relevan), empty state, validation error, calculation error, dan success feedback.

## 10. Aturan Bobot Default
- C1 = 0.30 (Benefit)
- C2 = 0.25 (Benefit)
- C3 = 0.20 (Cost)
- C4 = 0.15 (Benefit)
- C5 = 0.10 (Benefit)
Default weight harus menjadi nilai awal yang ditampilkan dan dapat dikonfigurasi; perubahan bobot tidak boleh mengubah tipe benefit/cost tanpa tindakan konfigurasi metodologi yang eksplisit.

## 11. Non-functional Requirements
- Responsive pada desktop/tablet/mobile.
- Bahasa antarmuka: Bahasa Indonesia.
- Konsisten, accessible contrast, label input jelas, navigasi keyboard dasar.
- Perhitungan deterministik dan dapat direproduksi dari input yang sama.
- Tidak menampilkan rekomendasi jika data belum valid atau belum memadai.
- MVP berjalan lokal menggunakan data mock; jangan menyatakan data sebagai data lapangan/real.

## 12. Sitemap MVP
1. Dashboard
2. Alternatif Lokasi
3. Input & Penilaian Kriteria
4. Bobot Kriteria
5. Hasil TOPSIS / Ranking
6. Detail Perhitungan

## 13. Acceptance Criteria
- Lima kriteria dan bobot default sesuai dokumen.
- Total bobot divalidasi 1.00.
- Benefit/cost diterapkan sesuai tipe kriteria.
- TOPSIS menghasilkan nilai preferensi dan ranking pada dataset valid.
- Detail tahapan kalkulasi dapat diperiksa.
- Pengguna dapat mengelola kandidat dan memperbarui input.
- UI memberi pesan yang jelas saat data belum cukup, tidak valid, atau kalkulasi tidak dapat dilakukan.
- MVP menggunakan data mock dan menandai data contoh dengan jelas.

## 14. Risiko & Mitigasi
- **Skala C3–C5 subjektif:** sediakan rubrik penilaian eksplisit dan konsisten.
- **Input volume/lahan tidak comparable:** tampilkan unit dan petunjuk sumber data.
- **Ranking dipersepsikan sebagai keputusan final:** tampilkan disclaimer keputusan tetap memerlukan verifikasi lapangan dan pertimbangan kebijakan.
- **Data mock disalahartikan sebagai real:** beri label “Data contoh”.
- **TOPSIS sensitif terhadap data/bobot:** tampilkan bobot, nilai input, dan detail kalkulasi.

## 15. Asumsi & Keputusan yang belum dikunci
- MVP berupa single-user prototype tanpa backend.
- Data kandidat awal menggunakan dummy/sample data.
- C3 kepadatan pemukiman sekitar, C4 aksesibilitas jalan truk, dan C5 partisipasi/kesiapan masyarakat memakai skala 1–5; rubrik penilaian C3–C5 wajib ditampilkan konsisten.
- Tidak ada peta/GIS pada MVP; penambahan peta membutuhkan approval scope.
- Ekspor laporan PDF melalui dialog cetak browser dan laporan Excel `.xlsx` telah disetujui sebagai fitur MVP.

## 16. Gate Persetujuan
**Phase 1 — PRD:** dokumen ini.  
**Phase 2 — UI-GUIDELINE:** visual system, layout, navigation, component rules, states, responsive rules, dan screen-by-screen UI direction.  
**Phase 3 — IMPLEMENTATION_PLAN:** struktur frontend, urutan implementasi, komponen, data model mock, kalkulasi TOPSIS, testing, dan definisi selesai.  
Setiap phase hanya dikerjakan setelah pengguna menyetujui phase sebelumnya. PRD ini belum memberi izin untuk coding.
