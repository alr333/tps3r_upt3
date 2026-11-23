// EDIT: Tambah/ubah field model atau validasi di sini. Jangan ubah bobot/tipe kriteria tanpa approval scope.
// COMMAND: Jalankan npm.cmd test untuk menguji perubahan data/validasi.
import { alternatives, criteria, datasetMeta, defaultWeights } from './seedAlternatives.js'

export const STORAGE_KEYS = {
  state: 'tps3r.site-intelligence.state.v1',
  snapshot: 'tps3r.site-intelligence.analysis.v1',
}

export const DATA_VERSION = datasetMeta.version
export const CRITERIA_CODES = ['C1', 'C2', 'C3', 'C4', 'C5']

export function cloneSampleData() {
  return {
    alternatives: structuredClone(alternatives),
    weights: { ...defaultWeights },
  }
}

export function normalizeAlternative(alternative, index = 0) {
  const district = alternative.district ?? alternative.kecamatan ?? ''
  const name = alternative.name ?? alternative.desa ?? ''
  const criteriaValues = alternative.criteriaValues ?? {
    C1: alternative.C1,
    C2: alternative.C2,
    C3: alternative.C3,
    C4: alternative.C4,
    C5: alternative.C5,
  }

  return {
    id: alternative.id ?? `A${index + 1}`,
    name,
    district,
    notes: alternative.notes ?? '',
    criteriaValues: { ...criteriaValues },
    createdAt: alternative.createdAt ?? null,
    updatedAt: alternative.updatedAt ?? null,
  }
}

export function normalizeWeights(weights) {
  return Object.fromEntries(
    CRITERIA_CODES.map((code) => [
      code,
      Number.isFinite(Number(weights?.[code]))
        ? Number(weights[code])
        : defaultWeights[code],
    ]),
  )
}

export function validateAlternative(alternative) {
  const errors = {}
  const normalized = normalizeAlternative(alternative)

  if (!normalized.name.trim()) {
    errors.name = 'Nama desa atau lokasi wajib diisi.'
  }

  for (const criterion of criteria) {
    const value = normalized.criteriaValues[criterion.id]
    if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value))) {
      errors[criterion.id] = `${criterion.name} wajib diisi dengan angka.`
      continue
    }

    if (Number(value) < 0) {
      errors[criterion.id] = 'Nilai kriteria tidak boleh negatif.'
      continue
    }

    if (['C3', 'C4', 'C5'].includes(criterion.id) &&
        (Number(value) < 1 || Number(value) > 5)) {
      errors[criterion.id] = 'Nilai skala harus berada pada rentang 1 sampai 5.'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateWeights(weights) {
  const normalized = normalizeWeights(weights)
  const errors = {}

  for (const code of CRITERIA_CODES) {
    if (!Number.isFinite(normalized[code]) || normalized[code] < 0) {
      errors[code] = 'Bobot harus berupa angka nonnegatif.'
    }
  }

  const total = CRITERIA_CODES.reduce((sum, code) => sum + normalized[code], 0)
  if (Math.abs(total - 1) > 0.000001) {
    errors.total = `Total bobot harus tepat 1.00. Total saat ini ${total.toFixed(2)}.`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    weights: normalized,
    total,
  }
}
