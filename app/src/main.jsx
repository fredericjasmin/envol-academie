import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { HomePage } from './pages/HomePage'
import { ServiciosPage } from './pages/ServiciosPage'
import { ServicioDetailPage } from './pages/ServicioDetailPage'
import { EspecialidadDetailPage } from './pages/EspecialidadDetailPage'
import { CreateServicioPage } from './pages/CreateServicioPage'
import { EditServicioPage } from './pages/EditServicioPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { RoleRoute } from './auth/RoleRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<App />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/servicios' element={<ServiciosPage />} />
            <Route path='/servicios/:id' element={<ServicioDetailPage />} />
            <Route path='/especialidades/:id' element={<EspecialidadDetailPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route
              path='/servicios/crear'
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['Administrador']}>
                    <CreateServicioPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path='/servicios/:id/editar'
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['Administrador']}>
                    <EditServicioPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)