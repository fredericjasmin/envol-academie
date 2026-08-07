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
import { AdicionalesPage } from './pages/AdicionalesPage'
import { AdicionalDetailPage } from './pages/AdicionalDetailPage'
import { CreateAdicionalPage } from './pages/CreateAdicionalPage'
import { EditAdicionalPage } from './pages/EditAdicionalPage'
import { PerfilPage } from './pages/PerfilPage'
import { EmpleadosPage } from './pages/EmpleadosPage'
import { EmpleadoDetailPage } from './pages/EmpleadoDetailPage'
import { CreateEmpleadoPage } from './pages/CreateEmpleadoPage'
import { EditEmpleadoPage } from './pages/EditEmpleadoPage'
import { HorariosAtencionPage } from './pages/HorariosAtencionPage'
import { HorarioDetailPage } from './pages/HorarioDetailPage'
import { CreateHorarioPage } from './pages/CreateHorarioPage'
import { EditHorarioPage } from './pages/EditHorarioPage'
import { RestriccionesPage } from './pages/RestriccionesPage'
import { RestriccionDetailPage } from './pages/RestriccionDetailPage'
import { CreateRestriccionPage } from './pages/CreateRestriccionPage'
import { EditRestriccionPage } from './pages/EditRestriccionPage'
import { CitasPage } from './pages/CitasPage'
import { CitaDetailPage } from './pages/CitaDetailPage'
import { CreateCitaPage } from './pages/CreateCitaPage'
import { EditCitaPage } from './pages/EditCitaPage'
import { AgendaDiariaPage } from './pages/AgendaDiariaPage'
import { MiAgendaPage } from './pages/MiAgendaPage'

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
            <Route path='/perfil' element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
            <Route path='/adicionales' element={<AdicionalesPage />} />
            <Route path='/adicionales/:id' element={<AdicionalDetailPage />} />
            <Route
              path='/adicionales/crear'
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['Administrador']}>
                    <CreateAdicionalPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path='/adicionales/:id/editar'
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['Administrador']}>
                    <EditAdicionalPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFoundPage />} />

            <Route path='/empleados' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><EmpleadosPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/empleados/crear' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><CreateEmpleadoPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/empleados/:id' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><EmpleadoDetailPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/empleados/:id/editar' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><EditEmpleadoPage /></RoleRoute></ProtectedRoute>
            } />

            <Route path='/horarios' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><HorariosAtencionPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/horarios/crear' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><CreateHorarioPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/horarios/:id' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><HorarioDetailPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/horarios/:id/editar' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><EditHorarioPage /></RoleRoute></ProtectedRoute>
            } />

            <Route path='/restricciones' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><RestriccionesPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/restricciones/crear' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><CreateRestriccionPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/restricciones/:id' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><RestriccionDetailPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/restricciones/:id/editar' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><EditRestriccionPage /></RoleRoute></ProtectedRoute>
            } />

            <Route path='/citas' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><CitasPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/citas/crear' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado']}><CreateCitaPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/citas/:id' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado', 'Cliente']}><CitaDetailPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/citas/:id/editar' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador', 'Empleado']}><EditCitaPage /></RoleRoute></ProtectedRoute>
            } />

            <Route path='/agenda-diaria' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Administrador']}><AgendaDiariaPage /></RoleRoute></ProtectedRoute>
            } />
            <Route path='/mi-agenda' element={
              <ProtectedRoute><RoleRoute allowedRoles={['Empleado']}><MiAgendaPage /></RoleRoute></ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)