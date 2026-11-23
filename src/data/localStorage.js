// EDIT: Key LocalStorage ada di STORAGE_KEYS; ubah hanya bila migrasi data disiapkan.
// COMMAND: Jalankan npm.cmd test untuk menguji save/load/reset/snapshot.
import { datasetMeta } from './seedAlternatives.js'
import {
  cloneSampleData,
  DATA_VERSION,
  normalizeAlternative,
  normalizeWeights,
  STORAGE_KEYS,
  validateAlternative,
  validateWeights,
} from './dataModel.js'

function createInitialState() {
  const sample = cloneSampleData()
  return {
    version: DATA_VERSION,
    datasetLabel: datasetMeta.label,
    fieldVerified: datasetMeta.fieldVerified,
    alternatives: sample.alternatives.map(normalizeAlternative),
    weights: sample.weights,
  }
}

export function loadState(storage = globalThis.localStorage) {
  const fallback = createInitialState()
  if (!storage) return fallback

  try {
    const raw = storage.getItem(STORAGE_KEYS.state)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    if (parsed?.version !== DATA_VERSION || !Array.isArray(parsed.alternatives)) {
      return fallback
    }

    const validAlternatives = parsed.alternatives
      .map(normalizeAlternative)
      .filter((alternative) => {
        const ids = parsed.alternatives.map((item) => item.id)
        return Boolean(alternative.id) && new Set(ids).size === ids.length
      })

    if (validAlternatives.length !== parsed.alternatives.length) return fallback

    return {
      version: DATA_VERSION,
      datasetLabel: datasetMeta.label,
      fieldVerified: false,
      alternatives: validAlternatives,
      weights: normalizeWeights(parsed.weights),
    }
  } catch {
    return fallback
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  if (!storage) return false

  try {
    storage.setItem(STORAGE_KEYS.state, JSON.stringify({
      version: DATA_VERSION,
      alternatives: state.alternatives,
      weights: state.weights,
    }))
    return true
  } catch {
    return false
  }
}

export function resetState(storage = globalThis.localStorage) {
  const initial = createInitialState()
  if (storage) {
    storage.removeItem(STORAGE_KEYS.state)
    storage.removeItem(STORAGE_KEYS.snapshot)
  }
  return initial
}

export function invalidateAnalysisSnapshot(storage = globalThis.localStorage) {
  if (!storage) return false

  try {
    storage.removeItem(STORAGE_KEYS.snapshot)
    return true
  } catch {
    return false
  }
}

export function saveAnalysisSnapshot(snapshot, storage = globalThis.localStorage) {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEYS.snapshot, JSON.stringify(snapshot))
    return true
  } catch {
    return false
  }
}

export function loadAnalysisSnapshot(storage = globalThis.localStorage) {
  if (!storage) return null
  try {
    const raw = storage.getItem(STORAGE_KEYS.snapshot)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getAlternativeCompleteness(alternative) {
  const normalized = normalizeAlternative(alternative)
  const validation = validateAlternative(normalized)
  const total = Object.keys(normalized.criteriaValues).length
  const complete = Object.values(normalized.criteriaValues)
    .filter((value) => value !== '' && value !== null && value !== undefined)
    .length

  return {
    complete,
    total,
    percentage: total === 0 ? 0 : Math.round((complete / total) * 100),
    valid: validation.valid,
  }
}

export function getDatasetStatus(state) {
  const weightStatus = validateWeights(state.weights)
  const alternativesStatus = state.alternatives.map(getAlternativeCompleteness)
  const completeCount = alternativesStatus.filter((status) => status.valid).length

  return {
    alternativeCount: state.alternatives.length,
    completeCount,
    complete: state.alternatives.length > 0 &&
      completeCount === state.alternatives.length &&
      weightStatus.valid,
  }
}
