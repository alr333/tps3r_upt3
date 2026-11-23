// EDIT: Ubah atau tambah tes teks rekomendasi di bagian test(...).
// COMMAND: Jalankan npm.cmd test.
import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTopsis } from './topsis.js'
import { alternatives, defaultWeights } from './seedAlternatives.js'
import { buildRecommendation } from './recommendation.js'

test('recommendation identifies top candidate and its rationale', () => {
  const result = calculateTopsis(alternatives, defaultWeights)
  const snapshot = {
    alternatives,
    weights: defaultWeights,
    result,
  }
  const recommendation = buildRecommendation(snapshot)

  assert.ok(recommendation)
  assert.match(recommendation.title, /Rekomendasi model:/)
  assert.equal(recommendation.summary.includes(result.ranking[0].name), true)
  assert.match(recommendation.rationale, /C1 30% dan C2 25%/)
})

test('recommendation returns null without valid result', () => {
  assert.equal(buildRecommendation({ alternatives, weights: defaultWeights, result: { valid: false } }), null)
})
