// EDIT: Ubah atau tambah tes sheet Excel di bagian test(...).
// COMMAND: Jalankan npm.cmd test.
import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTopsis } from './topsis.js'
import { alternatives, defaultWeights } from './seedAlternatives.js'
import { buildReportSheets } from './reportExport.js'

test('report builder creates all required TOPSIS sheets', () => {
  const result = calculateTopsis(alternatives, defaultWeights)
  const snapshot = {
    calculatedAt: '2026-11-22T18:00:00Z',
    alternatives,
    weights: defaultWeights,
    result,
  }

  const sheets = buildReportSheets(snapshot)

  assert.ok(sheets)
  assert.deepEqual(Object.keys(sheets), [
    'Ringkasan',
    'Nilai Kandidat',
    'Matriks Keputusan',
    'Normalisasi',
    'Matriks Terbobot',
    'Ideal dan Jarak',
  ])
  assert.ok(sheets.Ringkasan.length >= alternatives.length + 1)
  assert.equal(sheets['Nilai Kandidat'].length, alternatives.length + 1)
})

test('report builder rejects missing TOPSIS result', () => {
  assert.equal(buildReportSheets({ result: { valid: false } }), null)
})
