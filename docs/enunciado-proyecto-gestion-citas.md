# Enunciado Proyecto Gestión de Citas

## Alcance del proyecto

El objetivo del proyecto consiste en desarrollar exclusivamente el FrontEnd del sistema utilizando React, Tailwind CSS y shadcn/ui.

El Backend, la Base de Datos y el API ya han sido desarrollados previamente y forman parte del material suministrado. El equipo únicamente deberá consumir el API existente, implementar la interfaz de usuario, realizar las validaciones necesarias en el FrontEnd y respetar las reglas de negocio descritas en este documento.

**Repositorio del API de citas:** https://github.com/npaniagua26/api-citas

## Supuestos del proyecto

- Se asume que el API se encuentra completamente funcional.
- Los estudiantes deberán consumir únicamente los endpoints proporcionados.
- No deberán modificar la estructura del Backend.
- Las relaciones entre entidades ya se encuentran implementadas en el API.

## Módulos funcionales del sistema

El sistema estará compuesto por diferentes módulos funcionales que deberán ser desarrollados en el FrontEnd utilizando React. Cada módulo deberá consumir exclusivamente los endpoints disponibles en el API proporcionado.

El equipo no podrá modificar el Backend, crear nuevos endpoints ni cambiar la lógica implementada en el servidor. Todas las operaciones deberán realizarse utilizando las rutas existentes.

Para conocer los campos requeridos por cada entidad, los tipos de datos, relaciones y restricciones técnicas, cada equipo deberá consultar la documentación del API (Swagger o documentación suministrada).

Todos los formularios deberán gestionar la totalidad de la información requerida por el API para las operaciones de creación y actualización.

---

### Gestión de Usuarios

Este módulo permite la autenticación de los usuarios y el registro de nuevos clientes.

Los usuarios con rol Administrador y Empleado serán creados previamente en los datos iniciales del sistema y no podrán administrarse desde el FrontEnd.

El FrontEnd deberá consumir los endpoints del API relacionados con autenticación, consulta del usuario autenticado y registro público de clientes.

**Funcionalidades obligatorias**
- Iniciar sesión.
- Cerrar sesión.
- Registrar nuevos clientes mediante un formulario de registro público.
- Consultar la información del usuario autenticado.

**Requerimientos**
- El formulario de registro deberá administrar todos los campos requeridos por el API para crear un nuevo cliente.
- Después del inicio de sesión, el sistema deberá identificar el rol del usuario para habilitar únicamente las funcionalidades correspondientes.
- No está permitido crear usuarios con rol Administrador o Empleado desde el FrontEnd.

**Restricciones**

El sistema no deberá permitir:
- Registrar usuarios con información incompleta.
- Registrar usuarios con datos inválidos.
- Registrar usuarios con un rol diferente a Cliente.
- Modificar el rol del usuario autenticado.

**Reglas de negocio**
- El registro público únicamente permitirá crear clientes.
- Los administradores y empleados serán proporcionados como datos iniciales.
- Los permisos del sistema dependerán del rol del usuario autenticado.

**Flujo básico**
1. El usuario accede al formulario de inicio de sesión o registro.
2. Si no posee una cuenta podrá crear como cliente.
3. El sistema autenticará al usuario utilizando el API.
4. Según el rol recibido, mostrará únicamente las opciones permitidas.

---

### Consulta de Roles

Permite obtener los roles definidos por el API para utilizarlos internamente durante la autenticación y autorización del sistema. No constituye un módulo independiente del sistema.

**Funcionalidades obligatorias**

No requiere pantallas de administración. El FrontEnd únicamente deberá:
- Consumir los roles desde el API cuando sea necesario.
- Utilizar el rol del usuario autenticado para controlar el acceso a las diferentes funcionalidades.

**Requerimientos**
- Los roles deberán obtenerse directamente desde el API.
- No podrán almacenarse manualmente ni modificarse desde el FrontEnd.

**Restricciones**

No se permite:
- Crear roles.
- Editar roles.
- Eliminar roles.
- Mostrar un mantenimiento de roles.

**Reglas de negocio**
- Los permisos de navegación y acceso dependerán exclusivamente del rol recibido desde el API.

**Flujo básico**
1. Autenticar el usuario.
2. Obtener el rol.
3. Mostrar las opciones correspondientes.

---

### Consulta de Especialidades

Permite obtener las especialidades definidas por el API para utilizarlos internamente. No constituye un módulo independiente del sistema.

**Funcionalidades obligatorias**

No requiere pantallas de administración. El FrontEnd únicamente deberá:
- Consumir las especialidades desde el API cuando sea necesario.

**Requerimientos**
- Las especialidades deberán obtenerse directamente desde el API.
- No podrán almacenarse manualmente ni modificarse desde el FrontEnd.

**Restricciones**

No se permite:
- Crear especialidades.
- Editar especialidades.
- Eliminar especialidades.
- Mostrar un mantenimiento de especialidades.

---

### Gestión de Servicios

Este módulo administra los servicios principales ofrecidos por el establecimiento. Los servicios serán utilizados posteriormente durante el proceso de registro de citas.

Cada servicio posee un precio base y una duración, los cuales serán utilizados para calcular automáticamente el costo y la duración total de una cita.

**Funcionalidades obligatorias**
- Listar servicios.
- Ver detalle.
- Crear servicios.
- Editar servicios.
- Activar o desactivar servicios.

**Requerimientos**
- El formulario deberá administrar todos los campos requeridos por el API para la creación y actualización de servicios.
- Cada servicio deberá contar obligatoriamente con una imagen representativa. El formulario deberá permitir seleccionar, visualizar y almacenar una única imagen por servicio.
- Durante la edición de un servicio, el usuario podrá reemplazar la imagen existente por una nueva. La imagen anterior deberá dejar de utilizarse una vez completada la actualización.
- Los listados y el detalle del servicio deberán mostrar la imagen representativa correspondiente para facilitar su identificación visual.
- Los listados deberán mostrar la información más relevante para facilitar su consulta.
- El estado del servicio deberá visualizarse claramente.

**Restricciones**

El sistema no deberá permitir:
- Crear servicios con información incompleta.
- Registrar datos inválidos.
- Desactivar servicios que posean citas pendientes o confirmadas.
- Registrar imágenes con formatos no permitidos o que excedan el tamaño máximo definido por el API.

**Reglas de negocio**
- Solo los servicios activos podrán seleccionarse durante el registro de una cita.
- El precio base será utilizado para calcular el costo total.
- La duración será utilizada para calcular la hora de finalización.
- Todas las modificaciones deberán mantenerse sincronizadas con el API.

**Flujo básico**
1. Consultar los servicios existentes.
2. Registrar nuevos servicios.
3. Consultar el detalle.
4. Modificar información.
5. Activar o desactivar servicios.
6. Utilizar únicamente servicios activos en las citas.

---

### Gestión de Servicios Adicionales

Este módulo administra los servicios adicionales que pueden agregarse opcionalmente a una cita. Cada adicional incrementa el costo total.

**Funcionalidades obligatorias**
- Listar adicionales.
- Ver detalle.
- Crear adicionales.
- Editar adicionales.
- Activar o desactivar adicionales.

**Requerimientos**
- El formulario deberá administrar todos los campos requeridos por el API.
- Durante el registro de una cita, los adicionales deberán mostrarse para que el usuario pueda seleccionar uno o varios.

**Restricciones**

El sistema no deberá permitir:
- Registrar información incompleta.
- Registrar datos inválidos.
- Seleccionar adicionales inactivos durante una cita.

**Reglas de negocio**
- Un adicional podrá utilizarse en múltiples citas.
- Una cita podrá contener varios adicionales.
- Cada adicional seleccionado incrementará automáticamente el costo total.

**Flujo básico**
1. Consultar adicionales.
2. Registrar nuevos adicionales.
3. Consultar detalle.
4. Editar información.
5. Activar o desactivar adicionales.
6. Utilizar únicamente adicionales activos durante el registro de citas.

---

### Gestión de Empleados

Este módulo permite administrar los empleados que brindan los servicios del establecimiento. Los empleados serán asignados durante el registro de citas y serán responsables de atender los servicios solicitados por los clientes.

Cada empleado podrá estar asociado a uno o varios servicios, según su especialidad o funciones.

**Funcionalidades obligatorias**
- Listar empleados.
- Ver detalle.
- Crear empleados.
- Editar empleados.
- Activar o desactivar empleados.
- Asignar los servicios que puede realizar cada empleado desde el mismo formulario de creación o edición.
- Consultar la agenda del empleado.
- Consultar las restricciones que afectan al empleado.

**Requerimientos**
- El formulario deberá administrar toda la información requerida por el API para la creación y actualización de empleados.
- El formulario deberá permitir asignar o modificar los servicios asociados al empleado sin utilizar un módulo independiente.
- El código del empleado solo puede contener letras, números, guiones y guion bajo.
- El sistema deberá mostrar: información general del empleado, estado del empleado, servicios que puede realizar, cantidad de citas asignadas, restricciones registradas.
- Asignación de servicios: mediante lista de selección múltiple, grupo de casillas de verificación, dual list, u otro componente equivalente.
- El horario laboral de todos los empleados corresponde al horario general del establecimiento. Las únicas variaciones permitidas serán las restricciones registradas para un empleado específico.

**Restricciones**

El sistema no deberá permitir:
- Registrar empleados con información incompleta.
- Asociar un mismo usuario a más de un empleado.
- Desactivar empleados que tengan citas pendientes o confirmadas.
- Asignar citas a empleados inactivos.

**Reglas de negocio**
- Todo empleado deberá estar asociado a un usuario.
- Solo empleados activos podrán recibir nuevas citas.
- Un empleado únicamente podrá atender los servicios que tenga asignados.
- La información del empleado deberá mantenerse sincronizada con el API.

**Flujo básico**
1. Consultar los empleados registrados.
2. Registrar nuevos empleados.
3. Consultar el detalle de un empleado.
4. Modificar la información cuando sea necesario.
5. Consultar los servicios asignados.
6. Consultar las citas asignadas.
7. Activar o desactivar empleados.

---

### Gestión de Citas

Este módulo representa el proceso principal del sistema. Permite crear, consultar, modificar y administrar las citas de los clientes, considerando la disponibilidad del establecimiento, la agenda del empleado, las restricciones registradas, los servicios seleccionados y los adicionales asociados.

Todas las validaciones deberán realizarse utilizando la información obtenida desde el API.

**Funcionalidades obligatorias**
- Listar citas.
- Ver detalle de una cita.
- Crear citas.
- Editar citas.
- Cancelar citas.
- Cambiar el estado de una cita.
- Consultar la agenda del empleado.
- Consultar la disponibilidad del horario antes de crear o actualizar una cita.

**Requerimientos**

El formulario deberá administrar toda la información requerida por el API para crear y actualizar una cita. Durante el proceso el sistema deberá permitir:
- Seleccionar el cliente.
- Seleccionar el servicio principal.
- Seleccionar uno o varios servicios adicionales.
- Seleccionar el empleado.
- Seleccionar la fecha.
- Seleccionar la hora de inicio.
- Mostrar automáticamente la duración total.
- Mostrar automáticamente la hora de finalización.
- Mostrar automáticamente el costo total.
- Consultar la agenda del empleado.
- Consultar el horario general del establecimiento.
- Consultar las restricciones registradas.
- Consultar las citas existentes del empleado para la fecha seleccionada.
- Mostrar únicamente los horarios disponibles para el empleado seleccionado.

Toda la información deberá actualizarse dinámicamente conforme el usuario cambie cualquiera de los datos de la cita.

**Restricciones**

El sistema no deberá permitir:
- Registrar citas sin cliente / sin empleado / sin servicio.
- Registrar citas con fechas pasadas.
- Registrar citas fuera del horario de atención.
- Registrar citas durante restricciones generales o del empleado.
- Registrar citas con empleados inactivos.
- Registrar citas para servicios no asignados al empleado.
- Registrar citas que generen traslapes con otras citas.
- Editar citas finalizadas.
- Modificar citas canceladas.
- Cambiar el empleado o el horario cuando genere conflictos de disponibilidad.

**Reglas de negocio**

Antes de crear o actualizar una cita el sistema deberá verificar obligatoriamente:
- El horario general del establecimiento.
- Las restricciones generales del establecimiento.
- Las restricciones del empleado.
- Los servicios asignados al empleado.
- La duración total de la cita.
- La hora final calculada.
- Las citas ya asignadas al empleado para esa fecha.
- Que no existan traslapes entre la nueva cita y las citas existentes.

Para determinar la disponibilidad se deberá considerar el intervalo completo comprendido entre la hora de inicio y la hora de finalización de la cita.

Se considera un traslape cualquier coincidencia parcial o total entre dos intervalos de tiempo asignados al mismo empleado.

Las citas canceladas no deberán bloquear horarios disponibles. Las citas pendientes, confirmadas y en proceso deberán considerarse como horarios ocupados.

**Flujo básico**
1. Seleccionar el cliente.
2. Seleccionar el servicio principal.
3. Seleccionar los adicionales deseados.
4. Calcular automáticamente el costo y la duración.
5. Seleccionar el empleado.
6. Consultar la agenda del empleado.
7. Mostrar el horario del establecimiento.
8. Mostrar las restricciones existentes.
9. Mostrar las citas asignadas para la fecha seleccionada.
10. Verificar la disponibilidad del horario.
11. Registrar la cita.
12. Actualizar automáticamente la agenda del empleado.

---

### Gestión de Adicionales de la Cita

Este módulo administra los servicios adicionales asociados a cada cita. Su finalidad es permitir que un cliente agregue uno o varios adicionales al servicio principal seleccionado.

**Funcionalidades obligatorias**
- Consultar los adicionales disponibles.
- Agregar adicionales a una cita.
- Modificar los adicionales antes de guardar la cita.
- Consultar el detalle de los adicionales seleccionados.

**Requerimientos**
- El sistema deberá mostrar únicamente los adicionales activos.
- Cada vez que el usuario agregue o elimine un adicional deberá recalcular automáticamente el costo total.

**Restricciones**

El sistema no deberá permitir:
- Seleccionar adicionales inactivos.
- Registrar adicionales duplicados en una misma cita.
- Modificar adicionales cuando la cita ya se encuentre finalizada.

**Reglas de negocio**
- Los adicionales forman parte de la misma cita. No representan una cita independiente.
- Cada adicional incrementará el costo total.

**Flujo básico**
1. Consultar los adicionales disponibles.
2. Seleccionar uno o varios adicionales.
3. Actualizar automáticamente el costo.
4. Mostrar el resumen final de la cita.

---

### Consulta de Estados de la Cita

Permite obtener los estados definidos por el API para utilizarlos durante la administración de las citas. No constituye un módulo independiente del sistema.

**Funcionalidades obligatorias**

No requiere pantallas de mantenimiento. El FrontEnd únicamente deberá:
- Consultar los estados disponibles.
- Utilizarlos para mostrar el estado de las citas.
- Utilizarlos en los cambios de estado permitidos.

**Requerimientos**
- Los estados deberán obtenerse directamente desde el API.
- No podrán modificarse desde el FrontEnd.

**Restricciones**

No se permite:
- Crear, editar o eliminar estados.
- Mostrar un mantenimiento de estados.

**Reglas de negocio**
- Los estados controlarán las acciones disponibles sobre una cita.

**Flujo básico**
1. Consultar los estados.
2. Mostrar el estado correspondiente en cada cita.
3. Utilizar los estados durante los cambios permitidos.

---

### Gestión de Horarios de Atención

Este módulo permite administrar el horario general de atención del establecimiento. Todos los empleados comparten el mismo horario de atención definido para el establecimiento. La disponibilidad individual de un empleado únicamente podrá variar mediante las restricciones registradas.

El horario configurado será utilizado por el sistema para determinar si una cita puede ser registrada o modificada.

**Funcionalidades obligatorias**
- Listar los horarios registrados.
- Ver el detalle de un horario.
- No será necesario crear, editar o eliminar horarios.

**Requerimientos**
- El FrontEnd deberá consumir los endpoints disponibles para consultar la información de los horarios.

**Restricciones**
- No se podrán modificar ni crear nuevos horarios.
- Los horarios deberán consultarse directamente desde el API.

**Reglas de negocio**
- El establecimiento tendrá un único horario general de atención.
- Todos los empleados compartirán dicho horario.
- El horario será utilizado para validar la disponibilidad de todas las citas.
- Si un día se encuentra inactivo, no podrán crear citas para esa fecha.

**Flujo básico**
1. Consultar los horarios registrados.
2. Mostrar el detalle del horario seleccionado.
3. Utilizar esta información durante el registro y edición de citas.

---

### Gestión de Restricciones de Horario

Este módulo permite consultar las restricciones o excepciones al horario normal del establecimiento. Las restricciones podrán aplicarse al establecimiento completo o únicamente a un empleado específico. Estas restricciones estarán previamente registradas en los datos iniciales del sistema y serán utilizadas para bloquear automáticamente la asignación de nuevas citas durante los períodos definidos.

Para reducir la carga de desarrollo del proyecto, este módulo no requerirá formularios de creación, edición, activación ni desactivación en el FrontEnd.

**Funcionalidades obligatorias**
- Listar restricciones de horario.
- Ver el detalle de una restricción.
- Consultar restricciones durante el registro o edición de una cita.
- Validar que una cita no se registre dentro de una restricción existente.

**Requerimientos**

El FrontEnd deberá consumir los endpoints disponibles para consultar las restricciones registradas. El sistema deberá mostrar claramente:
- Si la restricción aplica al establecimiento completo o a un empleado específico.
- La fecha de la restricción.
- El horario restringido.
- El motivo de la restricción.
- El estado de la restricción, si el API lo proporciona.

Las restricciones deberán utilizarse automáticamente durante la validación de disponibilidad de citas.

**Restricciones**

No será obligatorio implementar crear/editar/activar/desactivar restricciones desde el FrontEnd. El sistema no deberá permitir crear o actualizar una cita cuando exista una restricción que coincida total o parcialmente con el horario solicitado.

**Reglas de negocio**
- Las restricciones generales afectan a todos los empleados.
- Las restricciones individuales únicamente afectan al empleado seleccionado.
- Las restricciones tienen prioridad sobre el horario general del establecimiento.
- Durante una restricción no podrán crear nuevas citas.
- El sistema deberá verificar si el intervalo de la cita se traslapa con el intervalo de una restricción.

**Flujo básico**
1. Consultar las restricciones existentes desde el API.
2. Mostrar el listado de restricciones.
3. Permitir consultar el detalle de una restricción.
4. Durante el registro o edición de una cita, consultar las restricciones aplicables.
5. Verificar si existe una restricción general para la fecha seleccionada.
6. Verificar si existe una restricción específica para el empleado seleccionado.
7. Comparar el horario solicitado de la cita con el rango horario restringido.
8. Impedir el registro o actualización de la cita si existe conflicto.

---

## Gestión del proceso principal

La gestión de citas constituye el proceso principal del sistema y representa la funcionalidad más importante del proyecto. Durante este proceso deberán integrarse todos los módulos desarrollados previamente para garantizar la correcta asignación de una cita.

El objetivo es que el usuario pueda crear una cita únicamente cuando exista disponibilidad real para el empleado seleccionado.

Las citas podrán ser creadas únicamente por usuarios con rol Administrador o Empleado. El Administrador podrá crear citas para cualquier cliente registrado. El Empleado podrá crear citas según las reglas definidas por el sistema y respetando la disponibilidad del horario, las restricciones, los servicios asignados y la agenda correspondiente.

Los clientes no podrán crear citas desde el sistema. Únicamente podrán consultar sus propias citas y cancelarlas cuando se encuentren en un estado que lo permita.

### Flujo general del proceso

1. Seleccionar el cliente.
2. Seleccionar el servicio principal.
3. Mostrar automáticamente el precio base y la duración del servicio.
4. Seleccionar uno o varios servicios adicionales.
5. Recalcular automáticamente el costo total.
6. Seleccionar el empleado.
7. Consultar los servicios que puede realizar el empleado.
8. Seleccionar la fecha.
9. Mostrar el horario del establecimiento.
10. Mostrar la agenda del empleado para esa fecha.
11. Mostrar las restricciones registradas.
12. Mostrar las citas asignadas.
13. Seleccionar la hora de inicio.
14. Calcular automáticamente la hora final.
15. Validar la disponibilidad completa.
16. Registrar la cita.
17. Actualizar automáticamente la agenda del empleado.

### Consulta de disponibilidad

Antes de crear o modificar una cita, el sistema deberá consultar toda la información necesaria para determinar si el horario solicitado se encuentra disponible. Como mínimo deberá verificarse:
- Horario general del establecimiento.
- Estado del día seleccionado.
- Restricciones generales y del empleado.
- Servicios asignados al empleado.
- Citas ya registradas para el empleado.
- Duración total de la cita y hora final calculada.
- Disponibilidad completa del intervalo solicitado.

La creación o modificación de una cita únicamente podrá completarse cuando todas las validaciones sean satisfactorias.

### Agenda del empleado

Durante el registro de una cita el sistema deberá mostrar la agenda del empleado seleccionado. Como mínimo deberá visualizar:
- Horario del establecimiento.
- Horario disponible / ocupado.
- Restricciones registradas.
- Citas existentes para la fecha seleccionada, con hora final.

Ejemplo de vista:

| Inicio | Fin | Estado |
|---|---|---|
| 08:00 | 09:00 | Disponible |
| 09:00 | 10:00 | Cita asignada |
| 10:00 | 11:30 | Cita asignada |
| 11:30 | 12:00 | Disponible |
| 12:00 | 13:00 | Restricción |
| 13:00 | 17:00 | Disponible |

### Cálculo automático de costo y duración

**Costo total** = Precio del servicio principal + suma de todos los servicios adicionales seleccionados. Cada modificación realizada por el usuario deberá recalcular inmediatamente el monto total.

> Nota: los servicios adicionales incrementan el costo total, pero no modifican la duración ni la hora de finalización de la cita.

**Duración total** = Duración del servicio principal. Cada modificación deberá actualizar automáticamente la duración total y la hora de finalización.

---

## Agenda diaria del establecimiento

Permite al Administrador consultar la agenda diaria del establecimiento para visualizar la distribución de citas programadas de cada empleado, facilitando la planificación e identificando horarios ocupados, disponibles y restringidos.

**Funcionalidades obligatorias**

El sistema deberá permitir al Administrador:
- Seleccionar una fecha.
- Consultar la agenda diaria del establecimiento.
- Visualizar el horario general de atención.
- Mostrar todos los empleados activos.
- Mostrar las citas asignadas a cada empleado para la fecha seleccionada.
- Identificar visualmente los horarios ocupados, disponibles y restringidos.
- Consultar el detalle de una cita desde la agenda.

**Requerimientos**

La agenda deberá construirse utilizando la información obtenida desde el API. Como mínimo deberá mostrar: horario general, nombre del empleado, hora inicio/fin de cada cita, cliente asignado, servicio principal, estado de la cita, restricciones que afecten al empleado o al establecimiento. La información deberá actualizarse automáticamente al cambiar la fecha seleccionada.

**Restricciones**
- Solo el Administrador podrá consultar la agenda completa del establecimiento.
- Los empleados únicamente podrán visualizar las citas asignadas a ellos.
- Los clientes únicamente podrán consultar sus propias citas.

**Reglas de negocio**
- La agenda deberá mostrar únicamente las citas correspondientes a la fecha seleccionada, ordenadas cronológicamente.
- Los períodos restringidos deberán diferenciarse visualmente de las citas programadas.
- Los horarios sin citas deberán mostrarse como espacios disponibles dentro del horario de atención.
- La agenda deberá actualizarse inmediatamente cuando una cita sea creada, modificada o cancelada.

**Flujo básico**
1. Seleccionar la fecha que se desea consultar.
2. Obtener el horario general del establecimiento.
3. Obtener la lista de empleados activos.
4. Consultar las citas registradas para la fecha seleccionada.
5. Consultar las restricciones aplicables.
6. Organizar las citas por empleado y hora de inicio.
7. Mostrar la agenda diaria con la disponibilidad correspondiente.

**Requerimiento visual mínimo** (ejemplo)

| Hora | Empleado 1 | Empleado 2 | Empleado 3 |
|---|---|---|---|
| 08:00 - 09:00 | Disponible | Corte de cabello | Restricción |
| 09:00 - 10:00 | Tinte | Corte + Lavado | Disponible |
| 10:00 - 11:00 | Barba | Disponible | Limpieza Facial |
| 11:00 - 12:00 | Disponible | Coloración | Disponible |
| 12:00 - 13:00 | Almuerzo (Restricción) | Almuerzo (Restricción) | Almuerzo (Restricción) |
| 13:00 - 14:00 | Masaje | Corte | Consulta |

Cada celda deberá mostrar, como mínimo: estado del horario, nombre del cliente (o identificador breve), servicio principal, hora de inicio y finalización de la cita.

---

## Matriz de permisos por rol

El sistema contará con tres tipos de usuarios: **Administrador**, **Empleado**, **Cliente**. Cada rol únicamente podrá acceder a las funcionalidades indicadas en la siguiente tabla.

| Módulo | Acción | Administrador | Empleado | Cliente |
|---|---|---|---|---|
| Autenticación | Iniciar sesión | ✔ | ✔ | ✔ |
| Registro | Registrar cliente | — | — | ✔ |
| Perfil | Consultar perfil | ✔ | ✔ | ✔ |
| Servicios | Listar / Ver detalle | ✔ | ✔ | ✔ |
| Servicios | Crear / Editar / Activar-Desactivar | ✔ | — | — |
| Adicionales | Listar / Ver detalle | ✔ | ✔ | ✔ |
| Adicionales | Crear / Editar / Activar-Desactivar | ✔ | — | — |
| Empleados | Listar / Ver detalle | ✔ | — | — |
| Empleados | Crear / Editar / Activar-Desactivar | ✔ | — | — |
| Horarios | Listar | ✔ | ✔ | ✔ |
| Restricciones | Listar / Ver detalle | ✔ | ✔ | ✔ |
| Citas | Listar / Ver detalle | ✔ | ✔ (solo asignadas) | ✔ (solo propias) |
| Citas | Crear | ✔ | ✔ | — |
| Citas | Editar | ✔ | ✔ (solo asignadas) | — |
| Citas | Cancelar | ✔ | ✔ (solo asignadas) | ✔ (solo propias y pendientes) |
| Citas | Cambiar estado | ✔ | ✔ | — |
| Agenda del empleado | Consultar | ✔ | ✔ (solo propias) | — |
| Agenda diaria del establecimiento | Consultar | ✔ | — | — |
| Disponibilidad | Consultar | ✔ | ✔ | ✔ |

Cuando un usuario no tenga permiso para una funcionalidad, esta no deberá mostrarse en la interfaz ni podrá accederse mediante navegación directa.

---

## Reglas generales de negocio

**Usuarios**
- Solo usuarios activos podrán utilizar el sistema.
- Todo usuario deberá tener un rol asignado.

**Empleados**
- Solo empleados activos podrán recibir citas.
- Un empleado únicamente podrá realizar los servicios que tenga asignados.

**Servicios**
- Solo podrán seleccionarse servicios activos.

**Adicionales**
- Solo podrán seleccionarse servicios adicionales activos.

**Horarios**
- No podrán crear citas fuera del horario del establecimiento.

**Restricciones**
- Las restricciones generales tendrán prioridad sobre el horario normal.
- Las restricciones individuales tendrán prioridad para el empleado correspondiente.

**Disponibilidad**
- Antes de crear o actualizar una cita el sistema deberá comprobar que no exista ningún traslape con otras citas del mismo empleado.
- Se considera un conflicto cuando cualquier parte del intervalo horario coincide con otra cita previamente registrada.
- Las citas canceladas no deberán bloquear horarios. Las citas pendientes y confirmadas sí deberán bloquear disponibilidad.

**Citas**
- Una cita únicamente puede estar asociada a un empleado.
- Una cita puede contener un único servicio principal.
- Una cita puede contener varios servicios adicionales.

---

## Validaciones generales del FrontEnd

Todos los formularios deberán realizar validaciones antes de enviar la información al API. Como mínimo deberán validar:
- Campos obligatorios.
- Tipos de datos.
- Formatos.
- Fechas válidas.
- Horarios válidos.
- Registros duplicados cuando corresponda.
- Información relacionada obligatoria.

El FrontEnd deberá mostrar mensajes claros cuando una validación no se cumpla. Estas validaciones complementan las realizadas por el Backend y no las reemplazan.

> Las validaciones únicamente serán evaluadas si son visibles y verificables en la interfaz (mensajes de error, campos deshabilitados, restricciones visuales, entre otros). Una validación que solo exista en el código pero no se refleje en la UI no será considerada para la evaluación.

---

## Navegación y pantallas mínimas

**Acceso al sistema**
- Inicio.
- Inicio de sesión.
- Registro de clientes.

**Perfil**
- Consultar perfil.

**Servicios**
- Listado, detalle, crear (con carga y vista previa de imagen), editar (con carga y vista previa de imagen).

**Adicionales**
- Listado, detalle, crear, editar.

**Empleados**
- Listado, detalle, crear, editar, asignación de servicios, consulta de agenda del empleado (integrada al registro y edición de citas).

**Horarios**
- Listado.

**Restricciones**
- Listado, detalle.

**Citas**
- Listado, detalle, crear, editar, cambio de estado, cancelación, consulta de disponibilidad, consulta de agenda del empleado integrada.

---

## Requerimientos visuales

La interfaz deberá desarrollarse utilizando React, Tailwind CSS y shadcn/ui, manteniendo una apariencia moderna, consistente y responsive. Como mínimo deberá cumplir con:
- Todos los valores mostrados en la interfaz (estados, fechas, horas, montos, mensajes) deberán presentarse en un formato claro y comprensible, evitando códigos internos, IDs crudos o formatos técnicos sin traducir (ej. mostrar "Confirmada" en vez de "status_2").
- La aplicación deberá manejar un único idioma de forma consistente en toda la interfaz. No se permite combinar idiomas.

**Navegación**
- Layout principal.
- Barra de navegación.
- Menú lateral o superior según el rol.
- Breadcrumb (opcional).
- Página 404 (No encontrada).

**Componentes**

Deberán utilizarse componentes reutilizables, como mínimo para: botones, formularios, tablas, tarjetas, cuadros de diálogo, mensajes, etiquetas de estado.

**Listados**

Todos los listados deberán incluir: ordenamiento, indicadores visuales de estado, botón de detalle, botón de edición cuando corresponda, y en el caso de servicios, una miniatura de la imagen representativa en cada tarjeta o fila.

**Formularios**

Todos los formularios deberán: mostrar errores de validación, indicar campos obligatorios, utilizar componentes de shadcn, impedir múltiples envíos simultáneos, mostrar mensajes de éxito o error.

**Gestión de citas**

Durante el registro de una cita deberán mostrarse simultáneamente: servicio seleccionado, adicionales seleccionados, costo total, duración total, hora final, agenda del empleado, horarios ocupados, horarios disponibles, restricciones registradas.

**Indicadores visuales**

Se recomienda utilizar colores para identificar estados. Ejemplo:
- Pendiente → Amarillo
- Confirmada → Azul
- Finalizada → Verde
- Cancelada → Rojo

---

## Datos iniciales proporcionados

Con el objetivo de que el sistema pueda ejecutarse desde el primer momento, el proyecto incluye un seeder que registra automáticamente la información mínima necesaria para el funcionamiento de la aplicación. Estos datos corresponden a catálogos del sistema y no deben ser modificados ni eliminados, ya que forman parte de la configuración base.

**Roles**
- Administrador
- Empleado
- Cliente

**Estados de cita**
- Pendiente
- Confirmada
- En proceso
- Finalizada
- Cancelada

Cada estado incluye su configuración correspondiente para determinar si bloquea disponibilidad, permite edición o cancelación por parte del cliente.

**Días de la semana**

Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo.

**Tipos de restricción de horario**
- General del establecimiento
- Específica de empleado
- Parcial por horas
- Día completo

**Especialidades**

Se incluye una especialidad inicial: **General**. Esta especialidad permite que el sistema pueda crear servicios y empleados desde el inicio. Posteriormente cada equipo deberá agregar las especialidades necesarias en los datos iniciales según la temática seleccionada para su proyecto.

**Usuario administrador inicial**

| Campo | Valor |
|---|---|
| Correo electrónico | admin@citas.com |
| Contraseña | Admin12345 |
| Rol | Administrador |

Este usuario será utilizado para realizar la configuración inicial del sistema, incluyendo el registro de empleados, servicios, especialidades adicionales, horarios de atención, servicios adicionales y demás información requerida por la temática del proyecto.

---

## Datos iniciales requeridos

Los estudiantes no podrán modificar el Backend. Únicamente podrán crear la información inicial necesaria para realizar las pruebas del sistema. Todos los registros o datos iniciales deberán ser coherentes con el dominio del problema seleccionado y permitir demostrar correctamente el cumplimiento de las reglas de negocio establecidas en el proyecto.

Como mínimo deberá existir:

**Usuarios**
- 1 administrador (existente en el API)
- 3 empleados
- 2 clientes

**Servicios**
- Por cada empleado: mínimo 3, máximo 5 servicios.

**Servicios adicionales**
- Al menos 8 servicios adicionales.

**Especialidades**
- Al menos 3 especialidades.

**Empleados**
- Al menos 3 empleados.

**Servicios por empleado**
- Cada empleado deberá tener asignados al menos 3 servicios diferentes.

**Horarios**
- Horario para todos los días de atención.

**Restricciones**

| Tipo de restricción | Cantidad mínima | Propósito de prueba |
|---|---|---|
| Restricción general del establecimiento | 2 | Verificar que no se puedan crear citas cuando todo el negocio está cerrado. |
| Restricción específica de empleado | 3 | Verificar que un empleado no pueda recibir citas durante un bloqueo individual. |
| Restricción parcial por horas | 2 | Verificar que el sistema bloquee solo un rango específico del día. |
| Restricción de día completo | 1 | Verificar que no se puedan crear citas durante todo el día. |

Ejemplos de restricciones recomendadas:

| Tipo | Fecha | Horario | Aplica a | Motivo |
|---|---|---|---|---|
| General | 15/09/2026 | Todo el día | Establecimiento | Feriado nacional |
| General | 24/12/2026 | 12:00 - 17:00 | Establecimiento | Cierre especial |
| Empleado | 18/09/2026 | 09:00 - 11:00 | Empleado 1 | Capacitación |
| Empleado | 19/09/2026 | 13:00 - 15:00 | Empleado 2 | Cita médica |
| Empleado | 20/09/2026 | 08:00 - 10:00 | Empleado 3 | Reunión interna |

Estas restricciones deberán utilizarse durante la demostración del proyecto para evidenciar que el sistema impide crear o actualizar citas en horarios no disponibles.

**Citas**

Como mínimo: 4 pendientes, 4 confirmadas, 3 finalizadas, 2 canceladas. Las citas deberán distribuirse entre todos los empleados para evidenciar correctamente la consulta de agenda y la validación de disponibilidad.

Los datos deberán permitir demostrar todas las funcionalidades durante la defensa del proyecto.

---

## Restricciones generales del proyecto

**Backend**

No se permite: modificar el API, endpoints, controladores, servicios, modelos, validaciones ni reglas de negocio.

**Base de datos**

No se permite: modificar la estructura, agregar/eliminar tablas, modificar relaciones. Únicamente podrán insertarse datos iniciales.

**FrontEnd**

Todo el trabajo deberá realizarse en React. No se permite utilizar otro framework.

**Consumo del API**

Todas las operaciones deberán realizarse utilizando los endpoints existentes. No podrán simular datos locales una vez iniciado el proyecto.

**Calidad**

El proyecto deberá: utilizar componentes reutilizables, mantener separación por módulos, utilizar servicios para consumir el API, mantener un diseño consistente.

---

## Aspectos técnicos obligatorios

**Arquitectura**
- React Router.
- Componentes reutilizables.
- Servicios para consumir el API.
- Layout principal.
- Rutas protegidas.
- Organización modular.

**Consumo del API**
- GET, POST, PUT.
- Manejo de errores.
- Loading.
- Manejo de estados vacíos.

**React**

Uso obligatorio de: useState, useEffect, Props, Componentes, Hooks, React Router. Se recomienda el uso de Context para la autenticación.

**Tailwind y shadcn**

Uso obligatorio de: variables de tema, componentes de shadcn, diseño responsive, espaciados consistentes.

---

## Validaciones

El FrontEnd deberá validar antes de enviar cualquier información. No deberá depender únicamente de las validaciones del API.

Además de las validaciones propias del API, el FrontEnd deberá validar como mínimo:
- Campos obligatorios.
- Longitud mínima y máxima.
- Fechas válidas.
- Horarios válidos.
- Selecciones obligatorias.
- Disponibilidad del empleado.
- Restricciones de horario.
- Traslapes de citas.

---

## Entregables y criterios de evaluación

Cada equipo deberá entregar:
- Proyecto React completamente funcional, con todos los recursos necesarios para su ejecución.
- Script de datos iniciales requeridos.

### Defensa del proyecto

Durante la defensa el docente podrá solicitar cualquier funcionalidad implementada. Cada integrante deberá explicar el funcionamiento técnico del código desarrollado.

### Criterios generales de evaluación

| Sección / Módulo | Peso (%) |
|---|---|
| 1. Gestión de Usuarios | 1.5% |
| 2. Catálogos de solo lectura (Roles, Especialidades y Estados de Cita) | 1.0% |
| 3. Gestión de Servicios | 2.0% |
| 4. Gestión de Servicios Adicionales | 1.5% |
| 5. Gestión de Empleados | 2.0% |
| 6. Gestión de Horarios de Atención | 1.0% |
| 7. Gestión de Restricciones de Horario | 1.5% |
| 8. Gestión de Citas (proceso principal) | 6.0% |
| 9. Gestión de Adicionales de la Cita | 1.0% |
| 10. Agenda diaria del establecimiento | 1.5% |
| 11. Validaciones generales del FrontEnd | 1.5% |
| 12. Aspectos técnicos obligatorios | 1.0% |
| 13. Aspectos generales de diseño y navegación (transversal) | 1.0% |
| 14. Autoevaluación | 1.5% |
| 15. Defensa técnica individual | 6.0% |
| **TOTAL AVANCE** | **30.0%** |
