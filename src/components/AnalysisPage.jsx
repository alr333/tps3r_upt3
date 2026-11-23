// EDIT: Tombol analisis dan tahapan kalkulasi ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/analisis.
import { useState } from 'react'
import { BarChart3, Play } from 'lucide-react'
import { Badge, Button, Card, Toast, ValidationMessage } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { calculateTopsis } from '../data/topsis.js'
import { saveAnalysisSnapshot } from '../data/localStorage.js'
import { CRITERIA_CODES } from '../data/dataModel.js'
import { criteria } from '../data/seedAlternatives.js'

export default function AnalysisPage({ onCalculated }) {
  const { state } = useAppState()
  const [notice, setNotice] = useState('')
  const [errors, setErrors] = useState(null)
  const [result, setResult] = useState(null)

  const runCalculation = () => {
    const calculation = calculateTopsis(state.alternatives, state.weights)
    if (!calculation.valid) {
      setErrors(calculation.errors)
      setResult(null)
      setNotice('')
      return
    }

    const snapshot = {
      calculatedAt: new Date().toISOString(),
      alternatives: state.alternatives,
      weights: state.weights,
      result: calculation,
    }
    saveAnalysisSnapshot(snapshot)
    setErrors(null)
    setResult(calculation)
    setNotice('Analisis TOPSIS berhasil dihitung.')
    onCalculated?.()
  }

  return (
    <>
      {notice && <Toast>{notice}</Toast>}
      {errors && (
        <Card className="analysis-error">
          <ValidationMessage>
            Analisis tidak dapat dijalankan. Periksa data kandidat dan bobot.
          </ValidationMessage>
        </Card>
      )}

      <div className="analysis-summary-grid">
        <Card className="analysis-summary-card">
          <span className="section-label">Kandidat aktif</span>
          <strong>{state.alternatives.length}</strong>
          <p>{state.alternatives.map((item) => item.name).join(', ') || 'Belum ada kandidat'}</p>
        </Card>
        <Card className="analysis-summary-card">
          <span className="section-label">Bobot aktif</span>
          <strong>{Object.values(state.weights).reduce((sum, value) => sum + Number(value), 0).toFixed(2)}</strong>
          <p>C1–C5 akan digunakan pada perhitungan berikutnya.</p>
        </Card>
      </div>

      <Card className="analysis-card">
        <div className="analysis-card-header">
          <div>
            <span className="criterion-code">TOPSIS</span>
            <h2>Siap menjalankan perhitungan</h2>
          </div>
          <Button type="button" onClick={runCalculation}>
            <Play size={16} aria-hidden="true" /> Mulai Perhitungan
          </Button>
        </div>
        <div className="calculation-steps">
          {['Matriks keputusan', 'Normalisasi vektor', 'Matriks terbobot', 'Solusi ideal', 'Jarak Euclidean', 'Nilai preferensi'].map((step, index) => (
            <div className="calculation-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </Card>

      {result?.valid && (
        <Card className="stage-card">
          <h2><BarChart3 size={18} aria-hidden="true" /> Matriks keputusan</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Alternatif</th>{CRITERIA_CODES.map((code) => <th key={code}>{code}</th>)}</tr></thead>
              <tbody>{result.decisionMatrix.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  {CRITERIA_CODES.map((code) => <td key={code}>{row.values[code]}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="stage-grid">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="stage-item">
                <strong>{criterion.id}</strong>
                <span>A+ {result.idealPositive[criterion.id].toFixed(4)}</span>
                <span>A− {result.idealNegative[criterion.id].toFixed(4)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}
