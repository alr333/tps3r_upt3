// EDIT: Kalimat rekomendasi dapat diubah pada nilai title, summary, dan rationale.
// COMMAND: Jalankan npm.cmd test untuk menguji kandidat dan bobot rekomendasi.
import { CRITERIA_CODES, normalizeAlternative } from './dataModel.js'

export function buildRecommendation(snapshot) {
  const top = snapshot?.result?.ranking?.[0]
  if (!snapshot?.result?.valid || !top) return null

  const candidate = snapshot.alternatives
    .map(normalizeAlternative)
    .find((item) => item.id === top.id)
  if (!candidate) return null

  const orderedWeights = [...CRITERIA_CODES]
    .sort((left, right) => snapshot.weights[right] - snapshot.weights[left])
    .slice(0, 2)
  const weightText = orderedWeights
    .map((code) => `${code} ${(snapshot.weights[code] * 100).toFixed(0)}%`)
    .join(' dan ')

  return {
    title: `Rekomendasi model: ${candidate.name}`,
    summary: `${candidate.name} menempati peringkat 1 dengan nilai preferensi Ci ${top.preference.toFixed(6)}.`,
    rationale: `Rekomendasi ini didukung oleh bobot terbesar pada ${weightText}. Kandidat memiliki jarak ${top.distancePositive.toFixed(6)} ke solusi ideal positif dan ${top.distanceNegative.toFixed(6)} ke solusi ideal negatif.`,
  }
}
