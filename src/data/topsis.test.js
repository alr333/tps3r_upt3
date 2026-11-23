// EDIT: Ubah atau tambah kasus TOPSIS di bagian test(...).
// COMMAND: Jalankan npm.cmd test.
import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTopsis } from './topsis.js'
import { alternatives, defaultWeights } from './seedAlternatives.js'
import { normalizeAlternative } from './dataModel.js'

test('TOPSIS calculates descending ranking for valid data', () => {
  const result = calculateTopsis(alternatives, defaultWeights)

  assert.equal(result.valid, true)
  assert.equal(result.ranking.length, alternatives.length)
  for (let index = 1; index < result.ranking.length; index += 1) {
    assert.ok(result.ranking[index - 1].preference >= result.ranking[index].preference)
  }
  assert.equal(result.ranking[0].rank, 1)
})

test('TOPSIS applies C3 as cost and C4/C5 as benefit', () => {
  const result = calculateTopsis([
    normalizeAlternative({ id: 'A', name: 'A', district: 'X', C1: 10, C2: 100, C3: 5, C4: 5, C5: 5 }),
    normalizeAlternative({ id: 'B', name: 'B', district: 'X', C1: 10, C2: 100, C3: 1, C4: 5, C5: 5 }),
  ], defaultWeights)

  assert.equal(result.valid, true)
  assert.equal(result.ranking[0].id, 'B')
})

test('TOPSIS rejects invalid weights and insufficient alternatives', () => {
  assert.equal(calculateTopsis(alternatives, { C1: 1 }).valid, false)
  assert.equal(calculateTopsis([alternatives[0]], defaultWeights).valid, false)
})

test('TOPSIS handles identical and constant columns without NaN or Infinity', () => {
  const identical = [
    normalizeAlternative({ id: 'A', name: 'A', district: 'X', C1: 1, C2: 1, C3: 3, C4: 3, C5: 3 }),
    normalizeAlternative({ id: 'B', name: 'B', district: 'X', C1: 1, C2: 1, C3: 3, C4: 3, C5: 3 }),
  ]
  const result = calculateTopsis(identical, defaultWeights)

  assert.equal(result.valid, true)
  assert.equal(result.normalizedMatrix.every((row) =>
    CRITERIA_VALUES(row.values).every((value) => Number.isFinite(value)),
  ), true)
  assert.equal(result.ranking.every((row) =>
    Number.isFinite(row.preference) &&
    row.preference >= 0 &&
    row.preference <= 1,
  ), true)
})

function CRITERIA_VALUES(values) {
  return Object.values(values)
}
