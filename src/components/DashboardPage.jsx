// EDIT: KPI, rekomendasi, grafik, dan bobot Dashboard ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/dashboard.
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { getDatasetStatus, loadAnalysisSnapshot } from '../data/localStorage.js'
import { buildRecommendation } from '../data/recommendation.js'

export default function DashboardPage({ onOpenAnalysis }) {
  const { state } = useAppState()
  const status = getDatasetStatus(state)
  const snapshot = loadAnalysisSnapshot()
  const snapshotOutdated = snapshot && (
    JSON.stringify(snapshot.alternatives) !== JSON.stringify(state.alternatives) ||
    JSON.stringify(snapshot.weights) !== JSON.stringify(state.weights)
  )
  const ranking = snapshot?.result?.ranking && !snapshotOutdated
    ? snapshot.result.ranking
    : []
  const top = ranking[0]
  const recommendation = snapshotOutdated ? null : buildRecommendation(snapshot)

  const chartData = ranking.map((item) => ({
    name: item.name,
    ci: Number(item.preference.toFixed(4)),
  }))

  return (
    <>
      <div className="kpi-grid">
        <Card className="kpi-card">
          <span>Jumlah alternatif</span>
          <strong>{status.alternativeCount}</strong>
          <small>Kandidat aktif</small>
        </Card>
        <Card className="kpi-card">
          <span>Kandidat ranking #1</span>
          <strong>{top?.name || 'Belum dihitung'}</strong>
          <small>{top ? `Rank 1 dari ${ranking.length}` : 'Bukan hasil aktif'}</small>
        </Card>
        <Card className="kpi-card">
          <span>Skor preferensi tertinggi</span>
          <strong>{top ? top.preference.toFixed(6) : '—'}</strong>
          <small>Nilai Ci</small>
        </Card>
        <Card className="kpi-card">
          <span>Status data</span>
          <strong>{status.complete ? 'Siap analisis' : 'Perlu dilengkapi'}</strong>
          <small>{status.completeCount}/{status.alternativeCount} kandidat lengkap</small>
        </Card>
      </div>

      {recommendation && (
        <Card className="recommendation-card">
          <span className="recommendation-eyebrow">Rekomendasi TOPSIS</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.summary}</p>
          <p className="recommendation-rationale">{recommendation.rationale}</p>
        </Card>
      )}

      <div className="dashboard-grid">
        <Card className="chart-card">
          <div className="ranking-header">
            <h2>Ringkasan ranking</h2>
            {snapshot ? <Badge tone="success">Hasil aktif</Badge> : <Badge tone="warning">Belum ada hasil</Badge>}
          </div>
          {chartData.length ? (
            <div className="chart-container" role="img" aria-label="Grafik nilai preferensi kandidat">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="ci" fill="#1D6B45" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="dashboard-empty">
              <p>Belum ada hasil TOPSIS untuk divisualkan.</p>
              <Button onClick={onOpenAnalysis}>Buka Analisis TOPSIS</Button>
            </div>
          )}
        </Card>

        <Card className="weight-chart-card">
          <h2>Bobot kriteria</h2>
          {Object.entries(state.weights).map(([code, weight]) => (
            <div className="weight-bar" key={code}>
              <div><strong>{code}</strong><span>{(Number(weight) * 100).toFixed(0)}%</span></div>
              <div className="weight-track"><span style={{ width: `${Number(weight) * 100}%` }} /></div>
            </div>
          ))}
        </Card>
      </div>

      <Card className="dashboard-disclaimer">
        <strong>Data Contoh — tidak divalidasi lapangan</strong>
        <p>Hasil mendukung, bukan menggantikan, keputusan penanggung jawab kebijakan.</p>
      </Card>
    </>
  )
}
