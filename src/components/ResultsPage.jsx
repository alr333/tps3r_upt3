// EDIT: Ranking, rekomendasi, ekspor Excel/PDF ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/hasil.
import { useState } from 'react'
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ChevronRight, Download, Printer } from 'lucide-react'
import { Badge, Card, Modal, Toast } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { loadAnalysisSnapshot } from '../data/localStorage.js'
import { CRITERIA_CODES } from '../data/dataModel.js'
import { exportResultsToExcel } from '../data/reportExport.js'
import { buildRecommendation } from '../data/recommendation.js'

export default function ResultsPage() {
  const { state } = useAppState()
  const [detail, setDetail] = useState(null)
  const snapshot = loadAnalysisSnapshot()
  const result = snapshot?.result

  if (!snapshot || !result?.valid) {
    return (
      <Card>
        <div className="empty-state results-empty">
          <div className="empty-state-mark" aria-hidden="true">—</div>
          <h2>Belum ada hasil perhitungan</h2>
          <p>Jalankan analisis TOPSIS setelah semua kandidat dan bobot valid.</p>
          <Badge tone="warning">Belum dihitung</Badge>
        </div>
      </Card>
    )
  }

  const snapshotOutdated =
    JSON.stringify(snapshot.alternatives) !== JSON.stringify(state.alternatives) ||
    JSON.stringify(snapshot.weights) !== JSON.stringify(state.weights)

  const chartData = result.ranking.map((item) => ({
    name: item.name,
    ci: Number(item.preference.toFixed(4)),
  }))
  const recommendation = snapshotOutdated ? null : buildRecommendation(snapshot)

  const printPdf = () => {
    window.print()
  }

  const downloadExcel = () => {
    exportResultsToExcel(snapshot)
  }

  return (
    <>
      {snapshotOutdated && (
        <Toast tone="warning">
          <AlertTriangle size={16} aria-hidden="true" /> Hasil ini berasal dari input lama. Jalankan ulang analisis.
        </Toast>
      )}
      <div className="print-report">
      {recommendation && (
        <Card className="recommendation-card">
          <span className="recommendation-eyebrow">Rekomendasi TOPSIS</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.summary}</p>
          <p className="recommendation-rationale">{recommendation.rationale}</p>
        </Card>
      )}
      <Card className="ranking-card">
        <div className="ranking-header">
          <div>
            <span className="section-label">Peringkat TOPSIS</span>
            <h2>Urutan kandidat rekomendasi model</h2>
          </div>
          <div className="report-actions">
            <Badge tone="warning">Data simulasi</Badge>
            <button type="button" className="report-button" onClick={downloadExcel}>
              <Download size={16} aria-hidden="true" /> Excel
            </button>
            <button type="button" className="report-button" onClick={printPdf}>
              <Printer size={16} aria-hidden="true" /> PDF
            </button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Rank</th><th>Kandidat</th><th>Ci</th><th>D+</th><th>D−</th><th>Detail</th></tr></thead>
            <tbody>{result.ranking.map((row) => (
              <tr key={row.id} className={row.rank === 1 ? 'top-row' : ''}>
                <td><span className="rank-badge">{row.rank}</span></td>
                <td><strong>{row.name}</strong></td>
                <td>{row.preference.toFixed(6)}</td>
                <td>{row.distancePositive.toFixed(6)}</td>
                <td>{row.distanceNegative.toFixed(6)}</td>
                <td>
                  <button type="button" className="detail-button" onClick={() => setDetail(row)}>
                    Buka <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <Card className="chart-card">
        <h2>Nilai preferensi kandidat</h2>
        <div className="chart-container" role="img" aria-label="Grafik batang nilai preferensi kandidat">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip formatter={(value) => [value, 'Ci']} />
              <Bar dataKey="ci" radius={[0, 8, 8, 0]}>
                {chartData.map((item, index) => <Cell key={item.name} fill={index === 0 ? '#1D6B45' : '#B9E769'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="decision-disclaimer">
        <strong>Catatan keputusan</strong>
        <p>Hasil TOPSIS mendukung analisis, bukan menggantikan verifikasi lapangan dan pertimbangan kebijakan.</p>
      </Card>
      </div>

      <Modal open={Boolean(detail)} title={detail?.name || 'Detail Kandidat'} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <dl className="detail-grid">
              <dt>Peringkat</dt><dd>{detail.rank}</dd>
              <dt>Nilai preferensi (Ci)</dt><dd>{detail.preference.toFixed(6)}</dd>
              <dt>Jarak ke ideal positif (D+)</dt><dd>{detail.distancePositive.toFixed(6)}</dd>
              <dt>Jarak ke ideal negatif (D−)</dt><dd>{detail.distanceNegative.toFixed(6)}</dd>
            </dl>
            <div className="detail-criteria">
              {CRITERIA_CODES.map((code) => {
                const candidate = snapshot.alternatives.find((item) => item.id === detail.id)
                return (
                  <div key={code}>
                    <strong>{code}</strong>
                    <span>{candidate?.criteriaValues?.[code] ?? '—'}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
