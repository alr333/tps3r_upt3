// EDIT: Sheet Excel ada pada buildReportSheets; nama file ada pada exportResultsToExcel.
// COMMAND: Jalankan npm.cmd test lalu buka Hasil & Ranking dan klik Excel.
import * as XLSX from 'xlsx'
import { CRITERIA_CODES } from './dataModel.js'
import { criteria } from './seedAlternatives.js'
import { buildRecommendation } from './recommendation.js'

export function buildReportSheets(snapshot) {
  const result = snapshot?.result
  if (!snapshot || !result?.valid) return null

  const ranking = [
    ['Peringkat', 'Kandidat', 'Nilai Preferensi (Ci)', 'Jarak D+', 'Jarak D-'],
    ...result.ranking.map((row) => [
      row.rank,
      row.name,
      row.preference,
      row.distancePositive,
      row.distanceNegative,
    ]),
  ]

  const candidates = [
    ['ID', 'Kandidat', 'Kecamatan', 'C1', 'C2', 'C3', 'C4', 'C5'],
    ...snapshot.alternatives.map((candidate) => [
      candidate.id,
      candidate.name,
      candidate.district,
      ...CRITERIA_CODES.map((code) => candidate.criteriaValues?.[code] ?? ''),
    ]),
  ]

  const matrix = [
    ['Alternatif', ...CRITERIA_CODES],
    ...result.decisionMatrix.map((row) => [row.name, ...CRITERIA_CODES.map((code) => row.values[code])]),
  ]

  const normalized = [
    ['Alternatif', ...CRITERIA_CODES],
    ...result.normalizedMatrix.map((row) => [row.name, ...CRITERIA_CODES.map((code) => row.values[code])]),
  ]

  const weighted = [
    ['Alternatif', ...CRITERIA_CODES],
    ...result.weightedMatrix.map((row) => [row.name, ...CRITERIA_CODES.map((code) => row.values[code])]),
  ]

  const idealsAndDistances = [
    ['Kriteria', 'Nama', 'Bobot', 'Tipe', 'Ideal Positif', 'Ideal Negatif'],
    ...criteria.map((criterion) => [
      criterion.id,
      criterion.name,
      snapshot.weights[criterion.id],
      criterion.type,
      result.idealPositive[criterion.id],
      result.idealNegative[criterion.id],
    ]),
  ]

  idealsAndDistances.push([])
  idealsAndDistances.push(['Alternatif', 'Jarak D+', 'Jarak D-', 'Nilai Ci', 'Peringkat'])
  result.ranking.forEach((row) => {
    idealsAndDistances.push([
      row.name,
      row.distancePositive,
      row.distanceNegative,
      row.preference,
      row.rank,
    ])
  })

  const recommendation = buildRecommendation(snapshot)
  if (recommendation) {
    ranking.push([])
    ranking.push(['Rekomendasi model', recommendation.title])
    ranking.push(['Ringkasan', recommendation.summary])
    ranking.push(['Alasan', recommendation.rationale])
  }

  return {
    Ringkasan: ranking,
    'Nilai Kandidat': candidates,
    'Matriks Keputusan': matrix,
    Normalisasi: normalized,
    'Matriks Terbobot': weighted,
    'Ideal dan Jarak': idealsAndDistances,
  }
}

export function exportResultsToExcel(snapshot) {
  const sheets = buildReportSheets(snapshot)
  if (!sheets) return false

  const workbook = XLSX.utils.book_new()
  Object.entries(sheets).forEach(([name, rows]) => {
    const sheet = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, sheet, name.slice(0, 31))
  })

  const timestamp = new Date().toISOString().slice(0, 10)
  const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `laporan-topsis-tps3r-${timestamp}.xlsx`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
