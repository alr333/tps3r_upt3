// EDIT: CRUD kandidat, pencarian, tabel, dan modal ada di file ini.
// COMMAND: Jalankan npm.cmd run dev lalu buka #/kandidat.
import { useMemo, useState } from 'react'
import { Badge, Button, Card, EmptyState, Modal, Toast } from './shared.jsx'
import { useAppState } from '../data/AppStateContext.jsx'
import { normalizeAlternative } from '../data/dataModel.js'
import { getAlternativeCompleteness, invalidateAnalysisSnapshot } from '../data/localStorage.js'

const emptyDraft = {
  name: '',
  district: '',
  notes: '',
  criteriaValues: { C1: '', C2: '', C3: '', C4: '', C5: '' },
}

export default function CandidatePage({ onOpenCriteria }) {
  const { state, setState, resetToSampleData } = useAppState()
  const [search, setSearch] = useState('')
  const [sortAscending, setSortAscending] = useState(true)
  const [editing, setEditing] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)
  const [notice, setNotice] = useState('')
  const [resetOpen, setResetOpen] = useState(false)

  const alternatives = useMemo(() => {
    const filtered = state.alternatives.filter((alternative) =>
      `${alternative.name} ${alternative.district}`.toLowerCase().includes(search.toLowerCase()),
    )
    return [...filtered].sort((a, b) =>
      sortAscending
        ? a.name.localeCompare(b.name, 'id')
        : b.name.localeCompare(a.name, 'id'),
    )
  }, [search, sortAscending, state.alternatives])

  const openCreate = () => {
    setEditing(null)
    setCreateOpen(true)
    setDraft(emptyDraft)
    setErrors({})
  }

  const openEdit = (alternative) => {
    setCreateOpen(false)
    setEditing(alternative.id)
    setDraft(normalizeAlternative(alternative))
    setErrors({})
  }

  const saveCandidate = (event) => {
    event.preventDefault()
    const wasEditing = Boolean(editing)
    const candidate = normalizeAlternative({
      ...draft,
      id: editing,
    })
    if (!candidate.name.trim()) {
      setErrors({ name: 'Nama desa atau lokasi wajib diisi.' })
      return
    }

    const duplicate = state.alternatives.some((alternative) =>
      alternative.id !== editing &&
      `${alternative.name} ${alternative.district}`.trim().toLowerCase() ===
      `${candidate.name} ${candidate.district}`.trim().toLowerCase(),
    )
    if (duplicate) {
      setErrors({ name: 'Nama lokasi kandidat sudah digunakan.' })
      return
    }

    const now = new Date().toISOString()
    setState((current) => {
      if (editing) {
        return {
          ...current,
          alternatives: current.alternatives.map((alternative) =>
            alternative.id === editing
              ? { ...candidate, id: editing, updatedAt: now, criteriaValues: candidate.criteriaValues }
              : alternative,
          ),
        }
      }

      const nextNumber = current.alternatives.reduce((maximum, alternative) => {
        const match = /^A(\d+)$/.exec(alternative.id)
        return match ? Math.max(maximum, Number(match[1])) : maximum
      }, 0) + 1
      return {
        ...current,
        alternatives: [
          ...current.alternatives,
          {
            ...candidate,
            id: `A${nextNumber}`,
            createdAt: now,
            updatedAt: now,
          },
        ],
      }
    })
    invalidateAnalysisSnapshot()
    setEditing(null)
    setCreateOpen(false)
    setDraft(emptyDraft)
    setErrors({})
    setNotice(wasEditing ? 'Kandidat berhasil diperbarui.' : 'Kandidat berhasil ditambahkan.')
  }

  const confirmDelete = () => {
    setState((current) => ({
      ...current,
      alternatives: current.alternatives.filter((alternative) => alternative.id !== deleteTarget.id),
    }))
    invalidateAnalysisSnapshot()
    setDeleteTarget(null)
    setNotice('Kandidat berhasil dihapus.')
  }

  const formOpen = createOpen || editing !== null

  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <span className="sr-only">Cari kandidat</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau kecamatan"
          />
        </label>
        <Button variant="secondary" type="button" onClick={() => setSortAscending((value) => !value)}>
          Urut {sortAscending ? 'A–Z' : 'Z–A'}
        </Button>
        <Button type="button" onClick={openCreate}>Tambah Kandidat</Button>
      </div>

      {notice && <Toast>{notice}</Toast>}

      {alternatives.length === 0 ? (
        <Card>
          <EmptyState
            title="Belum ada kandidat"
            description="Tambahkan lokasi kandidat untuk memulai penilaian."
            action={<Button onClick={openCreate}>Tambah Kandidat</Button>}
          />
        </Card>
      ) : (
        <Card className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Lokasi</th>
                  <th>C1</th>
                  <th>C2</th>
                  <th>C3</th>
                  <th>C4</th>
                  <th>C5</th>
                  <th>Kelengkapan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {alternatives.map((alternative) => {
                  const completeness = getAlternativeCompleteness(alternative)
                  return (
                    <tr key={alternative.id}>
                      <td>
                        <strong>{alternative.name}</strong>
                        <span className="cell-secondary">{alternative.district || 'Kecamatan belum diisi'}</span>
                      </td>
                      <td>{alternative.criteriaValues.C1 ?? '—'}</td>
                      <td>{alternative.criteriaValues.C2 ?? '—'}</td>
                      <td>{alternative.criteriaValues.C3 ?? '—'}</td>
                      <td>{alternative.criteriaValues.C4 ?? '—'}</td>
                      <td>{alternative.criteriaValues.C5 ?? '—'}</td>
                      <td>
                        <Badge tone={completeness.valid ? 'success' : 'warning'}>
                          {completeness.percentage}% · {completeness.valid ? 'Lengkap' : 'Perlu isi'}
                        </Badge>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => setDetailTarget(alternative)}>Detail</button>
                          <button type="button" onClick={() => openEdit(alternative)}>Edit</button>
                          <button type="button" className="danger-link" onClick={() => setDeleteTarget(alternative)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="page-actions">
        <Button variant="secondary" onClick={() => setResetOpen(true)}>Reset data contoh</Button>
      </div>

      <Modal open={formOpen} title={editing ? 'Edit Kandidat' : 'Tambah Kandidat'} onClose={() => {
        setEditing(null)
        setCreateOpen(false)
        setDraft(emptyDraft)
        setErrors({})
      }}>
        <form className="form-grid" onSubmit={saveCandidate}>
          <label>
            Nama desa/lokasi
            <input
              value={draft.name}
              onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Kecamatan induk
            <input
              value={draft.district}
              onChange={(event) => setDraft((value) => ({ ...value, district: event.target.value }))}
            />
          </label>
          <label className="form-full">
            Catatan
            <textarea
              value={draft.notes}
              onChange={(event) => setDraft((value) => ({ ...value, notes: event.target.value }))}
              rows="3"
            />
          </label>
          <div className="modal-actions form-full">
            <Button variant="secondary" type="button" onClick={() => {
              setEditing(null)
              setCreateOpen(false)
              setDraft(emptyDraft)
              setErrors({})
            }}>Batal</Button>
            <Button type="submit">Simpan Kandidat</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(deleteTarget)} title="Hapus Kandidat" onClose={() => setDeleteTarget(null)}>
        <p>Hapus <strong>{deleteTarget?.name}</strong> dari daftar kandidat? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button className="button-danger" onClick={confirmDelete}>Hapus</Button>
        </div>
      </Modal>

      <Modal open={Boolean(detailTarget)} title={detailTarget?.name || 'Detail Kandidat'} onClose={() => setDetailTarget(null)}>
        {detailTarget && (
          <dl className="detail-grid">
            <dt>Kecamatan</dt><dd>{detailTarget.district || '—'}</dd>
            <dt>Catatan</dt><dd>{detailTarget.notes || '—'}</dd>
            {['C1', 'C2', 'C3', 'C4', 'C5'].map((code) => (
              <div key={code}>
                <dt>{code}</dt><dd>{detailTarget.criteriaValues[code] ?? 'Belum diisi'}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setDetailTarget(null)}>Tutup</Button>
          {detailTarget && <Button onClick={() => onOpenCriteria(detailTarget.id)}>Buka Penilaian</Button>}
        </div>
      </Modal>

      <Modal open={resetOpen} title="Reset Data Contoh" onClose={() => setResetOpen(false)}>
        <p>Seluruh perubahan kandidat dan hasil analisis yang tersimpan akan diganti dengan data simulasi awal.</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setResetOpen(false)}>Batal</Button>
          <Button onClick={() => {
            resetToSampleData()
            setResetOpen(false)
            setNotice('Data simulasi berhasil dipulihkan.')
          }}>Reset</Button>
        </div>
      </Modal>
    </>
  )
}
