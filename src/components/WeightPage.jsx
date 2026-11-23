// EDIT: Input bobot, reset default, dan sum 1.00 ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/bobot.
import { useEffect, useState } from 'react'
import { Badge, Button, Card, Toast, ValidationMessage } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { criteria, defaultWeights } from '../data/seedAlternatives.js'
import { validateWeights } from '../data/dataModel.js'
import { invalidateAnalysisSnapshot } from '../data/localStorage.js'

export default function WeightPage() {
  const { state, setState } = useAppState()
  const [draft, setDraft] = useState(state.weights)
  const [notice, setNotice] = useState('')

  useEffect(() => setDraft(state.weights), [state.weights])

  const result = validateWeights(draft)

  const updateWeight = (code, value) => {
    setDraft((current) => ({ ...current, [code]: value === '' ? '' : Number(value) }))
  }

  const saveWeights = (event) => {
    event.preventDefault()
    if (!result.valid) return

    setState((current) => ({ ...current, weights: result.weights }))
    invalidateAnalysisSnapshot()
    setNotice('Bobot kriteria berhasil disimpan.')
  }

  const resetWeights = () => {
    setDraft({ ...defaultWeights })
    setState((current) => ({ ...current, weights: { ...defaultWeights } }))
    invalidateAnalysisSnapshot()
    setNotice('Bobot berhasil dikembalikan ke nilai default.')
  }

  return (
    <Card className="weight-card">
      {notice && <Toast>{notice}</Toast>}
      <form onSubmit={saveWeights}>
        <div className="weight-summary">
          <strong>Total bobot</strong>
          <span className={result.valid ? 'weight-total-valid' : 'weight-total-invalid'}>
            {result.total.toFixed(2)} / 1.00
          </span>
        </div>
        {result.errors.total && <ValidationMessage>{result.errors.total}</ValidationMessage>}

        <div className="weight-grid">
          {criteria.map((criterion) => (
            <div className="weight-field" key={criterion.id}>
              <div className="weight-heading">
                <div>
                  <span className="criterion-code">{criterion.id}</span>
                  <strong>{criterion.name}</strong>
                </div>
                <Badge tone={criterion.type === 'cost' ? 'warning' : 'success'}>
                  {criterion.type === 'cost' ? 'Cost' : 'Benefit'}
                </Badge>
              </div>
              <label className="numeric-field">
                Bobot
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={draft[criterion.id] ?? ''}
                  onChange={(event) => updateWeight(criterion.id, event.target.value)}
                  aria-invalid={Boolean(result.errors[criterion.id])}
                />
              </label>
              {result.errors[criterion.id] && (
                <ValidationMessage>{result.errors[criterion.id]}</ValidationMessage>
              )}
            </div>
          ))}
        </div>

        <div className="criteria-actions">
          <Button variant="secondary" type="button" onClick={resetWeights}>
            Reset ke default
          </Button>
          <Button type="submit" disabled={!result.valid}>
            Simpan Bobot
          </Button>
        </div>
      </form>
    </Card>
  )
}
