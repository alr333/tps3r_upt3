// EDIT: State global aplikasi disimpan di context ini.
// COMMAND: Jalankan npm.cmd run dev untuk melihat perubahan state.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { datasetMeta } from './seedAlternatives.js'
import {
  getDatasetStatus,
  loadState,
  resetState,
  saveState,
} from './localStorage.js'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [state, setState] = useState(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({
    state,
    setState,
    resetToSampleData: () => setState(resetState()),
    datasetMeta,
    getStatus: () => getDatasetStatus(state),
  }), [state])

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState harus digunakan di dalam AppStateProvider.')
  }
  return context
}
