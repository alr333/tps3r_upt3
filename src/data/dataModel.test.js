// EDIT: Ubah atau tambah tes validasi di bagian test(...).
// COMMAND: Jalankan npm.cmd test.
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeAlternative,
  validateAlternative,
  validateWeights,
} from './dataModel.js'
import { alternatives, defaultWeights } from './seedAlternatives.js'
import { cloneSampleData } from './dataModel.js'
import {
  getAlternativeCompleteness,
  getDatasetStatus,
  invalidateAnalysisSnapshot,
  loadState,
  resetState,
  saveState,
  saveAnalysisSnapshot,
  loadAnalysisSnapshot,
} from './localStorage.js'
import { STORAGE_KEYS } from './dataModel.js'

test('default weights are valid and total 1.00', () => {
  const result = validateWeights(defaultWeights)

  assert.equal(result.valid, true)
  assert.equal(result.total, 1)
})

test('weight validation rejects a non-unit total', () => {
  const result = validateWeights({
    C1: 0.5,
    C2: 0.2,
    C3: 0.2,
    C4: 0.1,
    C5: 0.1,
  })

  assert.equal(result.valid, false)
  assert.ok(result.errors.total)
})

test('seed alternatives normalize and validate', () => {
  for (const seed of alternatives) {
    const normalized = normalizeAlternative(seed)
    const result = validateAlternative(normalized)

    assert.equal(normalized.id, seed.id)
    assert.equal(result.valid, true)
  }
})

test('alternative validation rejects missing values and invalid ordinal ranges', () => {
  const normalized = normalizeAlternative({
    id: 'A-test',
    kecamatan: 'Ciawi',
    desa: '',
    C1: 10,
    C2: 300,
    C3: 6,
    C4: 4,
    C5: null,
  })
  const result = validateAlternative(normalized)

  assert.equal(result.valid, false)
  assert.ok(result.errors.name)
  assert.ok(result.errors.C3)
  assert.ok(result.errors.C5)
})

test('sample clone is isolated and completeness is derived from active data', () => {
  const first = cloneSampleData()
  const second = cloneSampleData()
  first.alternatives[0].C1 = 999

  assert.notEqual(first.alternatives[0].C1, second.alternatives[0].C1)
  assert.equal(second.weights.C1, 0.30)

  const incomplete = normalizeAlternative({
    id: 'A-incomplete',
    name: 'Lokasi Tidak Lengkap',
    district: 'Ciawi',
    criteriaValues: { C1: 10, C2: 300, C3: null, C4: 4, C5: 4 },
  })
  const completeness = getAlternativeCompleteness(incomplete)

  assert.equal(completeness.valid, false)
  assert.equal(completeness.percentage, 80)
})

test('local storage load, save, and reset preserve safe state', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }

  assert.equal(saveState(cloneSampleData(), storage), true)

  const initial = loadState(storage)
  const saved = {
    version: initial.version,
    alternatives: initial.alternatives,
    weights: { ...initial.weights },
  }
  assert.equal(saveState(saved, storage), true)

  const loaded = loadState(storage)
  assert.equal(loaded.datasetLabel, 'DATA SIMULASI')
  assert.equal(getDatasetStatus(loaded).alternativeCount, 6)

  const reset = resetState(storage)
  assert.equal(values.has(STORAGE_KEYS.state), false)
  assert.equal(values.has(STORAGE_KEYS.snapshot), false)
  assert.equal(reset.fieldVerified, false)
  assert.equal(reset.weights.C1, 0.30)
})

test('analysis snapshot is invalidated explicitly', () => {
  const values = new Map([
    [STORAGE_KEYS.snapshot, 'old-result'],
  ])
  const storage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }

  assert.equal(invalidateAnalysisSnapshot(storage), true)
  assert.equal(values.has(STORAGE_KEYS.snapshot), false)
})

test('analysis snapshot can be saved and loaded', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
  }
  const snapshot = { calculatedAt: '2026-11-22T17:00:00Z', result: { valid: true } }

  assert.equal(saveAnalysisSnapshot(snapshot, storage), true)
  assert.deepEqual(loadAnalysisSnapshot(storage), snapshot)
})
