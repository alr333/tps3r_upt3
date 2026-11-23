// EDIT: Ubah kandidat contoh, bobot default, atau definisi kriteria di file ini.
// COMMAND: Jalankan npm.cmd test sebelum npm.cmd run build.
// TPS3R Site Intelligence — initial user-provided simulation seed data.
// These values are not field-verified. Recalculate TOPSIS from active data; do not hard-code rankings.
export const defaultWeights = {
  C1: 0.30, // Unserved waste volume (Benefit)
  C2: 0.25, // Available land area (Benefit)
  C3: 0.20, // Kepadatan pemukiman sekitar (Cost)
  C4: 0.15, // Truck road accessibility (Benefit)
  C5: 0.10, // Community participation (Benefit)
};


export const criteria = [
  { id: 'C1', name: 'Sampah belum terlayani', unit: 'ton/hari', type: 'benefit', weight: 0.30 },
  { id: 'C2', name: 'Luas lahan tersedia', unit: 'm²', type: 'benefit', weight: 0.25 },
  { id: 'C3', name: 'Kepadatan pemukiman sekitar', unit: 'skala 1–5', type: 'cost', weight: 0.20 },
  { id: 'C4', name: 'Akses jalan truk', unit: 'skala 1–5', type: 'benefit', weight: 0.15 },
  { id: 'C5', name: 'Partisipasi warga', unit: 'skala 1–5', type: 'benefit', weight: 0.10 },
];


export const alternatives = [
  { id: 'A1', kecamatan: 'Ciawi', desa: 'Desa Pandansari', C1: 11.0, C2: 300, C3: 4, C4: 4, C5: 4 },
  { id: 'A2', kecamatan: 'Cijeruk', desa: 'Desa Palasari', C1: 7.5, C2: 450, C3: 2, C4: 3, C5: 4 },
  { id: 'A3', kecamatan: 'Caringin', desa: 'Desa Ciderum', C1: 9.0, C2: 550, C3: 2, C4: 4, C5: 5 },
  { id: 'A4', kecamatan: 'Cigombong', desa: 'Desa Watesjaya', C1: 8.2, C2: 400, C3: 3, C4: 4, C5: 3 },
  { id: 'A5', kecamatan: 'Megamendung', desa: 'Desa Cipayung Datar', C1: 8.8, C2: 380, C3: 3, C4: 4, C5: 4 },
  { id: 'A6', kecamatan: 'Cisarua', desa: 'Desa Tugu Selatan', C1: 10.2, C2: 260, C3: 4, C4: 3, C5: 4 },
];

export const datasetMeta = {
  version: 'v1',
  label: 'DATA SIMULASI',
  fieldVerified: false,
  description: 'Initial seed dataset supplied by the user for development and testing.',
};
