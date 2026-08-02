import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ServiciosPage } from './pages/ServiciosPage'
import { ServicioDetailPage } from './pages/ServicioDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/servicios' element={<ServiciosPage />} />
          <Route path='/servicios/:id' element={<ServicioDetailPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)