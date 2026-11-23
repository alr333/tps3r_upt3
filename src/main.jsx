// EDIT: File ini hanya untuk membuka aplikasi ke elemen #root.
// COMMAND: Jalankan npm.cmd run dev untuk melihat perubahan.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppStateProvider } from './data/AppStateContext.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>,
)
