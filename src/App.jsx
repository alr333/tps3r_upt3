// EDIT: navigation mengatur menu; pageContent mengatur judul; renderActivePage mengatur halaman.
// COMMAND: Jalankan npm.cmd run dev setelah mengubah route atau halaman.
import { useEffect, useState } from 'react'
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  PageHeader,
} from './components/shared.jsx'
import CandidatePage from './components/CandidatePage.jsx'
import CriteriaPage from './components/CriteriaPage.jsx'
import WeightPage from './components/WeightPage.jsx'
import AnalysisPage from './components/AnalysisPage.jsx'
import ResultsPage from './components/ResultsPage.jsx'
import DashboardPage from './components/DashboardPage.jsx'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', short: '01' },
  { id: 'kandidat', label: 'Kandidat Lokasi', short: '02' },
  { id: 'penilaian', label: 'Penilaian Kriteria', short: '03' },
  { id: 'analisis', label: 'Analisis TOPSIS', short: '04' },
  { id: 'hasil', label: 'Hasil & Ranking', short: '05' },
  { id: 'bobot', label: 'Pengaturan Bobot', short: '06' },
]

const pageContent = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Ringkasan keputusan kandidat TPS3R',
  },
  kandidat: {
    title: 'Kandidat Lokasi',
    subtitle: 'Kelola lokasi kandidat TPS3R',
  },
  penilaian: {
    title: 'Penilaian Kriteria',
    subtitle: 'Input dan validasi nilai lima kriteria',
  },
  analisis: {
    title: 'Analisis TOPSIS',
    subtitle: 'Tinjau input sebelum menjalankan perhitungan',
  },
  hasil: {
    title: 'Hasil & Ranking',
    subtitle: 'Prioritas kandidat berdasarkan nilai preferensi',
  },
  bobot: {
    title: 'Pengaturan Bobot',
    subtitle: 'Konfigurasi bobot kriteria keputusan',
  },
}

function getRouteFromHash() {
  const route = window.location.hash.replace('#/', '')
  return pageContent[route] ? route : 'dashboard'
}

function App() {
  const [activeRoute, setActiveRoute] = useState(getRouteFromHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState('')

  useEffect(() => {
    const handleHashChange = () => {
      setActiveRoute(getRouteFromHash())
      setMenuOpen(false)
    }

    window.addEventListener('hashchange', handleHashChange)
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const navigate = (route) => {
    window.location.hash = `/${route}`
  }

  const activePage = pageContent[activeRoute]
  const activeNavigation = navigation.find((item) => item.id === activeRoute)

  const openCriteria = (candidateId) => {
    setSelectedCandidateId(candidateId)
    navigate('penilaian')
  }

  const renderActivePage = () => {
    if (activeRoute === 'dashboard') {
      return <DashboardPage onOpenAnalysis={() => navigate('analisis')} />
    }
    if (activeRoute === 'kandidat') {
      return <CandidatePage onOpenCriteria={openCriteria} />
    }
    if (activeRoute === 'penilaian') {
      return (
        <CriteriaPage
          selectedCandidateId={selectedCandidateId}
          onSelectionHandled={() => setSelectedCandidateId('')}
        />
      )
    }
    if (activeRoute === 'bobot') {
      return <WeightPage />
    }
    if (activeRoute === 'analisis') {
      return <AnalysisPage />
    }
    if (activeRoute === 'hasil') {
      return <ResultsPage />
    }
    return (
      <Card className="placeholder-card">
        <EmptyState
          title="Modul belum tersedia"
          description={`Area ${activePage.title} akan diimplementasikan pada milestone berikutnya.`}
          action={<Badge tone="neutral">M1 — UI Shell</Badge>}
        />
      </Card>
    )
  }

  return (
    <main className="app-shell">
      <button
        className="drawer-backdrop"
        aria-label="Tutup navigasi"
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        id="primary-navigation"
        className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}
        aria-label="Navigasi utama"
      >
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">T</span>
          <div>
            <strong>TPS3R</strong>
            <span>Site Intelligence</span>
          </div>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Tutup navigasi"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              data-active={activeRoute === item.id}
              aria-current={activeRoute === item.id ? 'page' : undefined}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-short" aria-hidden="true">{item.short}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Badge tone="warning">Data contoh</Badge>
          <span>Prototipe lokal</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button
            type="button"
            className="menu-button"
            aria-label="Buka navigasi"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <Breadcrumbs items={['TPS3R', activeNavigation.label]} />
          <Badge tone="warning">Data simulasi</Badge>
        </header>

        <div className="content">
          <PageHeader
            title={activePage.title}
            subtitle={activePage.subtitle}
            action={
              activeRoute === 'dashboard'
                ? <Button onClick={() => navigate('analisis')}>Analisis TOPSIS</Button>
                : null
            }
          />

          {renderActivePage()}
        </div>
      </section>
    </main>
  )
}

export default App
