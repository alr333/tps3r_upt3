// EDIT: Tahapan TOPSIS ada di file ini. Pertahankan urutan benefit/cost dan validasi.
// COMMAND: Jalankan npm.cmd test untuk menguji normalisasi, ideal, jarak, dan ranking.
import { CRITERIA_CODES, normalizeAlternative, validateAlternative, validateWeights } from './dataModel.js'
import { criteria } from './seedAlternatives.js'

export function calculateTopsis(alternatives, weights) {
  const weightValidation = validateWeights(weights)
  if (!weightValidation.valid) {
    return { valid: false, errors: { weights: weightValidation.errors } }
  }

  if (!Array.isArray(alternatives) || alternatives.length < 2) {
    return {
      valid: false,
      errors: { alternatives: 'TOPSIS memerlukan minimal dua kandidat yang valid.' },
    }
  }

  const normalizedAlternatives = alternatives.map(normalizeAlternative)
  const alternativeErrors = {}
  normalizedAlternatives.forEach((alternative) => {
    const validation = validateAlternative(alternative)
    if (!validation.valid) alternativeErrors[alternative.id] = validation.errors
  })
  if (Object.keys(alternativeErrors).length > 0) {
    return { valid: false, errors: { alternatives: alternativeErrors } }
  }

  const decisionMatrix = normalizedAlternatives.map((alternative) => ({
    id: alternative.id,
    name: alternative.name,
    values: Object.fromEntries(
      CRITERIA_CODES.map((code) => [code, Number(alternative.criteriaValues[code])]),
    ),
  }))

  const columnNorms = Object.fromEntries(CRITERIA_CODES.map((code) => {
    const sumSquares = decisionMatrix.reduce(
      (sum, row) => sum + (row.values[code] ** 2),
      0,
    )
    return [code, Math.sqrt(sumSquares)]
  }))

  const normalizedMatrix = decisionMatrix.map((row) => ({
    id: row.id,
    name: row.name,
    values: Object.fromEntries(CRITERIA_CODES.map((code) => [
      code,
      columnNorms[code] === 0 ? 0 : row.values[code] / columnNorms[code],
    ])),
  }))

  const weightedMatrix = normalizedMatrix.map((row) => ({
    id: row.id,
    name: row.name,
    values: Object.fromEntries(CRITERIA_CODES.map((code) => [
      code,
      weightValidation.weights[code] * row.values[code],
    ])),
  }))

  const idealPositive = {}
  const idealNegative = {}
  for (const criterion of criteria) {
    const values = weightedMatrix.map((row) => row.values[criterion.id])
    if (criterion.type === 'benefit') {
      idealPositive[criterion.id] = Math.max(...values)
      idealNegative[criterion.id] = Math.min(...values)
    } else {
      idealPositive[criterion.id] = Math.min(...values)
      idealNegative[criterion.id] = Math.max(...values)
    }
  }

  const withDistances = weightedMatrix.map((row) => {
    const distancePositive = Math.sqrt(CRITERIA_CODES.reduce(
      (sum, code) => sum + ((row.values[code] - idealPositive[code]) ** 2),
      0,
    ))
    const distanceNegative = Math.sqrt(CRITERIA_CODES.reduce(
      (sum, code) => sum + ((row.values[code] - idealNegative[code]) ** 2),
      0,
    ))
    const denominator = distancePositive + distanceNegative
    const preference = denominator === 0
      ? 0
      : distanceNegative / denominator

    return {
      id: row.id,
      name: row.name,
      distancePositive,
      distanceNegative,
      preference,
    }
  })

  const ranking = [...withDistances].sort((a, b) => {
    if (b.preference !== a.preference) return b.preference - a.preference
    return a.name.localeCompare(b.name, 'id')
  }).map((item, index) => ({ ...item, rank: index + 1 }))

  return {
    valid: true,
    decisionMatrix,
    columnNorms,
    normalizedMatrix,
    weightedMatrix,
    idealPositive,
    idealNegative,
    distances: withDistances,
    preference: ranking,
    ranking,
  }
}
