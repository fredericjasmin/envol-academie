# Envol Académie

## Plan base del proyecto — Sistema de Gestión de Citas (Frontend React)

Escuela de vuelo real (aeroclub). Clientes reservan clases de vuelo con instructores certificados; el backend/API del curso ya está desarrollado y este proyecto cubre únicamente el FrontEnd (React + Tailwind + shadcn/ui), consumiendo el API existente y respetando sus reglas de negocio.

---

## 1. Identidad del proyecto

| Campo | Valor |
|---|---|
| Nombre | Envol Académie |
| Temática | Escuela de vuelo real — clases prácticas y teóricas con instructores certificados |
| Idioma de la interfaz | Español (único idioma en toda la app; el nombre de marca puede quedar en francés) |
| Paleta sugerida | Azul marino (#172B54) + Azul brillante (#005EBA) + Verde de acento (#008200), inspirada en Air France |

---

## 2. Roles (ya definidos por el API — no se tocan)

El sistema tiene tres roles fijos: **Administrador**, **Empleado (instructor)** y **Cliente (aspirante a piloto)**. No se crean, editan ni eliminan roles desde el FrontEnd; solo se consumen para mostrar u ocultar funcionalidades.

---

## 3. Mapeo de entidades del API a la temática

| Entidad del API | Qué representa en Envol Académie |
|---|---|
| Usuario / Cliente | Aspirante a piloto que reserva clases |
| Empleado | Instructor certificado |
| Especialidad | Área de instrucción (VFR, Instrumental/Maniobras, Teoría) |
| Servicio | Curso o clase específica (con precio y duración) |
| Servicio Adicional | Extras que se suman a una clase (no afectan duración) |
| Horario | Horario general de operación del aeroclub |
| Restricción | Bloqueos (mantenimiento, clima, ausencias de instructor) |
| Cita | Reserva de una clase de vuelo |
| Estado de cita | Pendiente / Confirmada / En proceso / Finalizada / Cancelada |

---

## 4. Instructores, especialidades y cursos

3 instructores, 3 especialidades, 9 cursos en total repartidos entre ellos (mínimo 3 por instructor).

### Instructor 1 — Especialidad: Vuelo VFR (Visual Flight Rules)

| Curso | Precio | Duración |
|---|---|---|
| Curso de Piloto Privado (PPL) — Módulo práctico | $180 | 90 min |
| Vuelo de Familiarización | $90 | 45 min |
| Navegación Visual (Cross-Country VFR) | $220 | 120 min |

### Instructor 2 — Especialidad: Vuelo por Instrumentos y Maniobras

| Curso | Precio | Duración |
|---|---|---|
| Maniobras de Emergencia y Pérdida de Sustentación (Stall Recovery) | $150 | 60 min |
| Vuelo Nocturno (Night Rating) | $200 | 90 min |
| Introducción al Vuelo Instrumental (IFR Basics) | $210 | 90 min |

### Instructor 3 — Especialidad: Teoría Aeronáutica y Examinación

| Curso | Precio | Duración |
|---|---|---|
| Reglamento Aeronáutico y Meteorología | $60 | 60 min |
| Preparación para Examen de Piloto Privado (Checkride Prep) | $190 | 120 min |
| Factores Humanos y Seguridad Operacional (CRM) | $70 | 60 min |

> **Nota:** el costo total de una cita = precio del curso + adicionales seleccionados. La duración total = solo la duración del curso principal (los adicionales no la modifican).

---

## 5. Servicios adicionales (8 — mínimo exacto)

| Adicional | Precio |
|---|---|
| Fotos aéreas del vuelo | $25 |
| Video del vuelo | $40 |
| Certificado de horas de vuelo | $10 |
| Equipo adicional (audífonos, bitácora) | $15 |
| Clase de repaso extra | $50 |
| Reporte de desempeño | $20 |
| Transporte al aeródromo | $15 |
| Snack / refrigerio a bordo | $8 |

---

## 6. Horario general y restricciones

**Horario general del establecimiento:** Lunes a Sábado, 6:00 a.m. – 5:00 p.m. (según luz solar). Domingo cerrado.

### Restricciones de ejemplo (mínimos exigidos)

| Tipo | Fecha | Horario | Aplica a | Motivo |
|---|---|---|---|---|
| General | 15/09/2026 | Todo el día | Establecimiento | Feriado nacional |
| General | 24/12/2026 | 12:00–17:00 | Establecimiento | Cierre especial |
| Empleado | 18/09/2026 | 09:00–11:00 | Instructor 1 | Capacitación |
| Empleado | 19/09/2026 | 13:00–15:00 | Instructor 2 | Cita médica |
| Empleado | 20/09/2026 | 08:00–10:00 | Instructor 3 | Reunión interna |
| Parcial por horas | 22/09/2026 | 10:00–12:00 | Establecimiento | Mantenimiento de aeronave 1 |
| Parcial por horas | 23/09/2026 | 14:00–16:00 | Establecimiento | Mantenimiento de aeronave 2 |
| Día completo | 30/09/2026 | Todo el día | Establecimiento | Mantenimiento mayor de flota |

---

## 7. Citas de prueba (seeder)

Mínimo exigido: 4 pendientes, 4 confirmadas, 3 finalizadas, 2 canceladas — distribuidas entre los 3 instructores para poder demostrar agenda y disponibilidad en la defensa.

- 4 citas **Pendientes** — repartidas entre los 3 instructores
- 4 citas **Confirmadas** — repartidas entre los 3 instructores
- 3 citas **Finalizadas** — con fechas pasadas, para mostrar historial
- 2 citas **Canceladas** — para verificar que no bloquean horarios

---

## 8. Checklist de módulos obligatorios

- [ ] **Gestión de Usuarios** — login, logout, registro público (solo Cliente), perfil propio
- [ ] **Consulta de Roles** — solo interno, sin pantalla de mantenimiento
- [ ] **Consulta de Especialidades** — solo interno, sin pantalla de mantenimiento
- [ ] **Gestión de Servicios** — listar, detalle, crear, editar, activar/desactivar (con imagen obligatoria)
- [ ] **Gestión de Servicios Adicionales** — listar, detalle, crear, editar, activar/desactivar
- [ ] **Gestión de Empleados** — listar, detalle, crear, editar, activar/desactivar, asignar servicios, ver agenda y restricciones
- [ ] **Gestión de Citas (proceso principal)** — listar, detalle, crear, editar, cancelar, cambiar estado, disponibilidad, agenda del instructor
- [ ] **Gestión de Adicionales de la Cita** — agregar/quitar antes de guardar, recálculo automático de costo
- [ ] **Consulta de Estados de la Cita** — solo interno, sin mantenimiento
- [ ] **Gestión de Horarios de Atención** — solo listar y ver detalle
- [ ] **Gestión de Restricciones de Horario** — solo listar y ver detalle
- [ ] **Agenda diaria del establecimiento** — solo Administrador, vista tipo tabla
- [ ] **Cálculo automático de costo y duración** — costo = curso + adicionales; duración = solo del curso principal

---

## 9. Pantallas mínimas

- Inicio / Login / Registro
- Perfil
- Servicios: listado, detalle, crear (con imagen), editar (con imagen)
- Adicionales: listado, detalle, crear, editar
- Empleados: listado, detalle, crear, editar (con asignación de servicios), agenda integrada
- Horarios: listado
- Restricciones: listado, detalle
- Citas: listado, detalle, crear, editar, cambio de estado, cancelación, disponibilidad, agenda integrada
- Agenda diaria del establecimiento (solo Admin)
- Página 404

---

## 10. Requisitos técnicos obligatorios

- React + React Router + rutas protegidas por rol
- Tailwind CSS + shadcn/ui, diseño responsive
- Servicios separados para consumir el API (no lógica de fetch dentro de componentes sueltos)
- useState, useEffect, Context (recomendado para auth), Hooks, Props
- Manejo de GET / POST / PUT, loading, errores y estados vacíos
- Validaciones visibles en la UI: campos obligatorios, longitud, fechas/horarios válidos, disponibilidad, traslapes
- Un solo idioma en toda la interfaz (español)
- Nada de datos simulados/locales una vez arrancado el proyecto — todo contra el API real

---

## 11. Qué NO se debe hacer

- No modificar Backend / API / Base de datos (solo insertar datos iniciales)
- No crear pantallas de mantenimiento para Roles, Especialidades, Estados de Cita, Horarios o Restricciones
- No permitir que el Cliente cree citas (solo Admin y Empleado pueden)
- No mostrar IDs crudos o códigos técnicos en la UI (traducir todo: "Confirmada", no "status_2")
- No mezclar idiomas en ningún texto de la interfaz

---

## 12. Pendiente por decidir

- Logo y paleta final de Envol Académie
- Nombres definitivos de los 3 instructores (persona)
- Fotos/imágenes representativas de cada curso
- Redacción final de mensajes de validación y estados en la UI

---

*Envol Académie — Documento de planificación interna del proyecto*
