// EDIT: Rubrik C1–C5 dan validasi penilaian ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/penilaian.
import { useEffect, useState } from 'react'
import { Badge, Button, Card, EmptyState, Toast } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { criteria } from '../data/seedAlternatives.js'
import { normalizeAlternative, validateAlternative } from '../data/dataModel.js'
import { invalidateAnalysisSnapshot } from '../data/localStorage.js'

const criterionHelp = {
  C1: 'Masukkan volume sampah belum terlayani dalam ton per hari.',
  C2: 'Masukkan luas lahan yang tersedia dalam meter persegi.',
  C3: '1 = kepadatan sangat rendah; 2 = rendah; 3 = sedang; 4 = tinggi; 5 = sangat tinggi. Nilai tinggi adalah kondisi cost yang kurang diinginkan.',
  C4: '1 = sangat sulit; 2 = sulit; 3 = cukup; 4 = baik; 5 = sangat baik.',
  C5: '1 = sangat rendah; 2 = rendah; 3 = cukup; 4 = tinggi; 5 = sangat tinggi.',
}

export default function CriteriaPage({ selectedCandidateId, onSelectionHandled }) {
  const { state, setState } = useAppState()
  const [candidateId, setCandidateId] = useState(selectedCandidateId || state.alternatives[0]?.id || '')
  const [draft, setDraft] = useState({})
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  const candidate = state.alternatives.find((item) => item.id === candidateId)

  useEffect(() => {
    if (selectedCandidateId) {
      setCandidateId(selectedCandidateId)
      onSelectionHandled?.()
    }
  }, [selectedCandidateId, onSelectionHandled])

  useEffect(() => {
    setDraft(candidate ? normalizeAlternative(candidate).criteriaValues : {})
    setErrors({})
  }, [candidateId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (state.alternatives.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Belum ada kandidat"
          description="Tambahkan kandidat lokasi sebelum mengisi penilaian kriteria."
        />
      </Card>
    )
  }

  const updateValue = (code, value) => {
    setDraft((current) => ({ ...current, [code]: value }))
  }

  const saveCriteria = (event) => {
    event.preventDefault()

    const updated = normalizeAlternative({
      ...candidate,
      criteriaValues: draft,
    })
    const result = validateAlternative(updated)

    if (!result.valid) {
      setErrors(result.errors)
      setNotice('')
      return
    }

    const now = new Date().toISOString()
    const numericDraft = Object.fromEntries(
      Object.entries(draft).map(([code, value]) =>
        ['C1', 'C2', 'C3', 'C4', 'C5'].includes(code)
          ? [code, Number(value)]
          : [code, value],
      ),
    )
    setState((current) => ({
      ...current,
      alternatives: current.alternatives.map((item) =>
        item.id === candidateId
          ? { ...item, criteriaValues: numericDraft, updatedAt: now }
          : item,
      ),
    }))
    invalidateAnalysisSnapshot()
    setErrors({})
    setNotice('Penilaian kriteria berhasil disimpan.')
  }

  return (
    <div className="criteria-layout">
      <Card className="candidate-selector-card">
        <label>
          Kandidat lokasi
          <select value={candidateId} onChange={(event) => setCandidateId(event.target.value)}>
            {state.alternatives.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.district}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <Card className="criteria-form-card">
        {notice && <Toast>{notice}</Toast>}
        <form onSubmit={saveCriteria}>
          <div className="criteria-grid">
            {criteria.map((criterion) => {
              const ordinal = ['C3', 'C4', 'C5'].includes(criterion.id)
              return (
                <div className="criteria-field" key={criterion.id}>
                  <div className="criteria-heading">
                    <div>
                      <span className="criterion-code">{criterion.id}</span>
                      <strong>{criterion.name}</strong>
                    </div>
                    <Badge tone={criterion.type === 'cost' ? 'warning' : 'success'}>
                      {criterion.type === 'cost' ? 'Cost' : 'Benefit'}
                    </Badge>
                  </div>

                  {ordinal ? (
                    <fieldset className="rating-control">
                      <legend>Skor 1–5</legend>
                      <div className="rating-options">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <label key={value}>
                            <input
                              type="radio"
                              name={criterion.id}
                              value={value}
                              checked={Number(draft[criterion.id]) === value}
                              onChange={() => updateValue(criterion.id, value)}
                            />
                            <span>{value}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <label className="numeric-field">
                      Nilai
                      <div className="input-with-unit">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draft[criterion.id] ?? ''}
                          onChange={(event) => updateValue(criterion.id, event.target.value)}
                          aria-invalid={Boolean(errors[criterion.id])}
                        />
                        <span>{criterion.unit}</span>
                      </div>
                    </label>
                  )}

                  <p className="field-help">{criterionHelp[criterion.id]}</p>
                  {errors[criterion.id] && <span className="field-error">{errors[criterion.id]}</span>}
                </div>
              )
            })}
          </div>
          <div className="criteria-actions">
            <Button variant="secondary" type="button" onClick={() => {
              setDraft(candidate ? normalizeAlternative(candidate).criteriaValues : {})
              setErrors({})
              setNotice('')
            }}>Batal</Button>
            <Button type="submit">Simpan Penilaian</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
