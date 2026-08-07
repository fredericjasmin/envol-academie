import { prisma } from "../src/config/prisma";
import bcrypt from "bcryptjs";

// Helpers de formato (misma convención que usa el API)
const toDate = (fecha: string) => new Date(`${fecha}T00:00:00`);
const toTime = (hora: string) => new Date(`1970-01-01T${hora}:00`);

async function main() {
    console.log("Iniciando seed de Envol Académie...");

    // ===== Especialidades (base: "General" ya existe) =====
    const especialidadesData = [
        {
            nombre: "Vuelo VFR",
            descripcion: "Instrucción de vuelo visual (Visual Flight Rules).",
        },
        {
            nombre: "Vuelo por Instrumentos y Maniobras",
            descripcion: "Instrucción de vuelo por instrumentos y maniobras.",
        },
        {
            nombre: "Teoría Aeronáutica y Examinación",
            descripcion: "Formación teórica y preparación de exámenes.",
        },
    ];

    for (const especialidad of especialidadesData) {
        await prisma.especialidad.upsert({
            where: { nombre: especialidad.nombre },
            update: {},
            create: { ...especialidad, activo: true },
        });
    }

    // ===== Usuarios (instructores y clientes) =====
    const rolEmpleado = await prisma.rol.findUniqueOrThrow({
        where: { nombre: "Empleado" },
    });
    const rolCliente = await prisma.rol.findUniqueOrThrow({
        where: { nombre: "Cliente" },
    });

    const passwordInstructor = await bcrypt.hash("Instructor123", 10);
    const passwordCliente = await bcrypt.hash("Cliente123", 10);

    const instructoresData = [
        {
            nombre: "Marc",
            primerApellido: "Bouchard",
            segundoApellido: "Rivera",
            correo: "marc.bouchard@envol.academie",
            telefono: "88880001",
            codigoEmpleado: "EMP-001",
            especialidad: "Vuelo VFR",
            descripcion: "Instructor certificado de vuelo visual (VFR).",
            servicios: [
                "Curso de Piloto Privado (PPL) - Módulo práctico",
                "Vuelo de Familiarización",
                "Navegación Visual (Cross-Country VFR)",
            ],
        },
        {
            nombre: "Clara",
            primerApellido: "Moretti",
            segundoApellido: "Duval",
            correo: "clara.moretti@envol.academie",
            telefono: "88880002",
            codigoEmpleado: "EMP-002",
            especialidad: "Vuelo por Instrumentos y Maniobras",
            descripcion: "Instructora certificada de vuelo por instrumentos y maniobras.",
            servicios: [
                "Maniobras de Emergencia y Pérdida de Sustentación (Stall Recovery)",
                "Vuelo Nocturno (Night Rating)",
                "Introducción al Vuelo Instrumental (IFR Basics)",
            ],
        },
        {
            nombre: "Simon",
            primerApellido: "Rousseau",
            segundoApellido: "Tremblay",
            correo: "simon.rousseau@envol.academie",
            telefono: "88880003",
            codigoEmpleado: "EMP-003",
            especialidad: "Teoría Aeronáutica y Examinación",
            descripcion: "Instructor de teoría aeronáutica y examinación.",
            servicios: [
                "Reglamento Aeronáutico y Meteorología",
                "Preparación para Examen de Piloto Privado (Checkride Prep)",
                "Factores Humanos y Seguridad Operacional (CRM)",
            ],
        },
    ];

    const clientesData = [
        {
            nombre: "María",
            primerApellido: "López",
            segundoApellido: "Mora",
            correo: "maria.lopez@gmail.com",
            telefono: "88880004",
        },
        {
            nombre: "Jorge",
            primerApellido: "Pérez",
            segundoApellido: "Solís",
            correo: "jorge.perez@hotmail.com",
            telefono: "88880005",
        },
    ];

    for (const instructor of instructoresData) {
        await prisma.usuario.upsert({
            where: { correo: instructor.correo },
            update: {},
            create: {
                nombre: instructor.nombre,
                primerApellido: instructor.primerApellido,
                segundoApellido: instructor.segundoApellido,
                correo: instructor.correo,
                telefono: instructor.telefono,
                passwordHash: passwordInstructor,
                activo: true,
                rolId: rolEmpleado.id,
            },
        });
    }

    for (const cliente of clientesData) {
        await prisma.usuario.upsert({
            where: { correo: cliente.correo },
            update: {},
            create: {
                ...cliente,
                passwordHash: passwordCliente,
                activo: true,
                rolId: rolCliente.id,
            },
        });
    }

    // ===== Servicios (cursos) =====
    // La imagen se deja en null; se asigna cuando esté lista la subida de imágenes.
    const serviciosData = [
        {
            nombre: "Curso de Piloto Privado (PPL) - Módulo práctico",
            descripcion: "Práctica de vuelo para obtener la licencia de piloto privado.",
            precioBase: 180,
            duracionMinutos: 90,
            especialidad: "Vuelo VFR",
            imagen: "curso-piloto-privado-ppl.jpg",
        },
        {
            nombre: "Vuelo de Familiarización",
            descripcion: "Primer vuelo de acercamiento a la operación de una aeronave.",
            precioBase: 90,
            duracionMinutos: 45,
            especialidad: "Vuelo VFR",
            imagen: "vuelo-familiarizacion.jpg",
        },
        {
            nombre: "Navegación Visual (Cross-Country VFR)",
            descripcion: "Vuelo de navegación visual entre aeródromos.",
            precioBase: 220,
            duracionMinutos: 120,
            especialidad: "Vuelo VFR",
            imagen: "navegacion-visual-vfr.jpg",
        },
        {
            nombre: "Maniobras de Emergencia y Pérdida de Sustentación (Stall Recovery)",
            descripcion: "Práctica de maniobras de emergencia y recuperación de pérdida de sustentación.",
            precioBase: 150,
            duracionMinutos: 60,
            especialidad: "Vuelo por Instrumentos y Maniobras",
            imagen: "maniobras-emergencia-stall-recovery.jpeg",
        },
        {
            nombre: "Vuelo Nocturno (Night Rating)",
            descripcion: "Entrenamiento de vuelo nocturno para ampliar la habilitación.",
            precioBase: 200,
            duracionMinutos: 90,
            especialidad: "Vuelo por Instrumentos y Maniobras",
            imagen: "vuelo-nocturno-night-rating.jpg",
        },
        {
            nombre: "Introducción al Vuelo Instrumental (IFR Basics)",
            descripcion: "Introducción a la operación de la aeronave bajo reglas de vuelo por instrumentos.",
            precioBase: 210,
            duracionMinutos: 90,
            especialidad: "Vuelo por Instrumentos y Maniobras",
            imagen: "intro-vuelo-instrumental-ifr.jpg",
        },
        {
            nombre: "Reglamento Aeronáutico y Meteorología",
            descripcion: "Clase teórica de reglamento aeronáutico y fundamentos de meteorología.",
            precioBase: 60,
            duracionMinutos: 60,
            especialidad: "Teoría Aeronáutica y Examinación",
            imagen: "reglamento-aeronautico-meteorologia.jpg",
        },
        {
            nombre: "Preparación para Examen de Piloto Privado (Checkride Prep)",
            descripcion: "Preparación completa para el examen práctico de piloto privado.",
            precioBase: 190,
            duracionMinutos: 120,
            especialidad: "Teoría Aeronáutica y Examinación",
            imagen: "preparacion-checkride.jpg",
        },
        {
            nombre: "Factores Humanos y Seguridad Operacional (CRM)",
            descripcion: "Clase teórica de factores humanos y gestión de recursos de cabina.",
            precioBase: 70,
            duracionMinutos: 60,
            especialidad: "Teoría Aeronáutica y Examinación",
            imagen: "factores-humanos-crm.jpg",
        },
    ];

    for (const servicio of serviciosData) {
        const especialidad = await prisma.especialidad.findUniqueOrThrow({
            where: { nombre: servicio.especialidad },
        });
        await prisma.servicio.upsert({
            where: { nombre: servicio.nombre },
            update: { imagen: servicio.imagen },
            create: {
                nombre: servicio.nombre,
                descripcion: servicio.descripcion,
                precioBase: servicio.precioBase,
                duracionMinutos: servicio.duracionMinutos,
                imagen: servicio.imagen,
                activo: true,
                especialidadId: especialidad.id,
            },
        });
    }

    // ===== Servicios adicionales =====
    const adicionalesData = [
        { nombre: "Fotos aéreas del vuelo", descripcion: "Galería de fotos tomadas durante el vuelo.", precio: 25 },
        { nombre: "Video del vuelo", descripcion: "Grabación en video del vuelo completo.", precio: 40 },
        { nombre: "Certificado de horas de vuelo", descripcion: "Certificado oficial de las horas de vuelo realizadas.", precio: 10 },
        { nombre: "Equipo adicional (audífonos, bitácora)", descripcion: "Alquiler de equipo adicional para la clase.", precio: 15 },
        { nombre: "Clase de repaso extra", descripcion: "Clase adicional de repaso con el instructor.", precio: 50 },
        { nombre: "Reporte de desempeño", descripcion: "Reporte detallado del desempeño del aspirante.", precio: 20 },
        { nombre: "Transporte al aeródromo", descripcion: "Servicio de transporte al aeródromo.", precio: 15 },
        { nombre: "Snack / refrigerio a bordo", descripcion: "Refrigerio incluido durante la clase.", precio: 8 },
    ];

    for (const adicional of adicionalesData) {
        await prisma.servicioAdicional.upsert({
            where: { nombre: adicional.nombre },
            update: {},
            create: { ...adicional, activo: true },
        });
    }

    // ===== Empleados (con servicios asignados) =====
    for (const instructor of instructoresData) {
        const usuario = await prisma.usuario.findUniqueOrThrow({
            where: { correo: instructor.correo },
        });
        const especialidad = await prisma.especialidad.findUniqueOrThrow({
            where: { nombre: instructor.especialidad },
        });
        const servicioIds = await Promise.all(
            instructor.servicios.map(async (nombre) => {
                const servicio = await prisma.servicio.findUniqueOrThrow({
                    where: { nombre },
                });
                return { id: servicio.id };
            })
        );

        await prisma.empleado.upsert({
            where: { codigoEmpleado: instructor.codigoEmpleado },
            update: {
                descripcion: instructor.descripcion,
                especialidadId: especialidad.id,
                servicios: { set: servicioIds },
            },
            create: {
                usuarioId: usuario.id,
                especialidadId: especialidad.id,
                codigoEmpleado: instructor.codigoEmpleado,
                descripcion: instructor.descripcion,
                activo: true,
                servicios: { connect: servicioIds },
            },
        });
    }

    // ===== Horarios de atención (Lunes a Sábado, Domingo cerrado) =====
    const diasAtencion = [1, 2, 3, 4, 5, 6];
    for (const numeroOrden of diasAtencion) {
        const dia = await prisma.diaSemana.findUniqueOrThrow({
            where: { numeroOrden },
        });
        await prisma.horarioAtencion.upsert({
            where: {
                diaSemanaId_horaInicio_horaFin: {
                    diaSemanaId: dia.id,
                    horaInicio: toTime("06:00"),
                    horaFin: toTime("17:00"),
                },
            },
            update: {},
            create: {
                diaSemanaId: dia.id,
                horaInicio: toTime("06:00"),
                horaFin: toTime("17:00"),
                activo: true,
            },
        });
    }

    // ===== Restricciones de horario =====
    const tipoGeneral = await prisma.tipoRestriccionHorario.findUniqueOrThrow({
        where: { nombre: "General del establecimiento" },
    });
    const tipoEmpleado = await prisma.tipoRestriccionHorario.findUniqueOrThrow({
        where: { nombre: "Específica de empleado" },
    });
    const tipoParcial = await prisma.tipoRestriccionHorario.findUniqueOrThrow({
        where: { nombre: "Parcial por horas" },
    });
    const tipoDiaCompleto = await prisma.tipoRestriccionHorario.findUniqueOrThrow({
        where: { nombre: "Día completo" },
    });

    const restriccionesData = [
        {
            tipoRestriccionId: tipoGeneral.id,
            empleadoId: null,
            fecha: toDate("2026-09-15"),
            horaInicio: null,
            horaFin: null,
            todoElDia: true,
            motivo: "Feriado nacional",
        },
        {
            tipoRestriccionId: tipoGeneral.id,
            empleadoId: null,
            fecha: toDate("2026-12-24"),
            horaInicio: toTime("12:00"),
            horaFin: toTime("17:00"),
            todoElDia: false,
            motivo: "Cierre especial",
        },
        {
            tipoRestriccionId: tipoEmpleado.id,
            empleadoId: "EMP-001",
            fecha: toDate("2026-09-18"),
            horaInicio: toTime("09:00"),
            horaFin: toTime("11:00"),
            todoElDia: false,
            motivo: "Capacitación",
        },
        {
            tipoRestriccionId: tipoEmpleado.id,
            empleadoId: "EMP-002",
            fecha: toDate("2026-09-19"),
            horaInicio: toTime("13:00"),
            horaFin: toTime("15:00"),
            todoElDia: false,
            motivo: "Cita médica",
        },
        {
            tipoRestriccionId: tipoEmpleado.id,
            empleadoId: "EMP-003",
            fecha: toDate("2026-09-20"),
            horaInicio: toTime("08:00"),
            horaFin: toTime("10:00"),
            todoElDia: false,
            motivo: "Reunión interna",
        },
        {
            tipoRestriccionId: tipoParcial.id,
            empleadoId: null,
            fecha: toDate("2026-09-22"),
            horaInicio: toTime("10:00"),
            horaFin: toTime("12:00"),
            todoElDia: false,
            motivo: "Mantenimiento de aeronave 1",
        },
        {
            tipoRestriccionId: tipoParcial.id,
            empleadoId: null,
            fecha: toDate("2026-09-23"),
            horaInicio: toTime("14:00"),
            horaFin: toTime("16:00"),
            todoElDia: false,
            motivo: "Mantenimiento de aeronave 2",
        },
        {
            tipoRestriccionId: tipoDiaCompleto.id,
            empleadoId: null,
            fecha: toDate("2026-09-30"),
            horaInicio: null,
            horaFin: null,
            todoElDia: true,
            motivo: "Mantenimiento mayor de flota",
        },
    ];

    for (const restriccion of restriccionesData) {
        let empleadoId: number | null = null;
        if (restriccion.empleadoId) {
            const empleado = await prisma.empleado.findUniqueOrThrow({
                where: { codigoEmpleado: restriccion.empleadoId },
            });
            empleadoId = empleado.id;
        }

        const existe = await prisma.restriccionHorario.findFirst({
            where: {
                tipoRestriccionId: restriccion.tipoRestriccionId,
                fecha: restriccion.fecha,
                motivo: restriccion.motivo,
            },
        });
        if (!existe) {
            await prisma.restriccionHorario.create({
                data: {
                    tipoRestriccionId: restriccion.tipoRestriccionId,
                    empleadoId,
                    fecha: restriccion.fecha,
                    horaInicio: restriccion.horaInicio,
                    horaFin: restriccion.horaFin,
                    todoElDia: restriccion.todoElDia,
                    motivo: restriccion.motivo,
                    activo: true,
                },
            });
        }
    }

    // ===== Citas de prueba =====
    const admin = await prisma.usuario.findUniqueOrThrow({
        where: { correo: "admin@citas.com" },
    });
    const estadoPendiente = await prisma.estadoCita.findUniqueOrThrow({
        where: { nombre: "Pendiente" },
    });
    const estadoConfirmada = await prisma.estadoCita.findUniqueOrThrow({
        where: { nombre: "Confirmada" },
    });
    const estadoFinalizada = await prisma.estadoCita.findUniqueOrThrow({
        where: { nombre: "Finalizada" },
    });
    const estadoCancelada = await prisma.estadoCita.findUniqueOrThrow({
        where: { nombre: "Cancelada" },
    });

    const citasData = [
        // Finalizadas (fechas pasadas)
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-001",
            servicio: "Curso de Piloto Privado (PPL) - Módulo práctico",
            estado: estadoFinalizada,
            fecha: "2026-07-10",
            horaInicio: "09:00",
            horaFin: "10:30",
            adicionales: [],
            observaciones: "Primera clase práctica de piloto privado.",
            motivoCancelacion: null,
        },
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-002",
            servicio: "Maniobras de Emergencia y Pérdida de Sustentación (Stall Recovery)",
            estado: estadoFinalizada,
            fecha: "2026-07-15",
            horaInicio: "14:00",
            horaFin: "15:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-003",
            servicio: "Reglamento Aeronáutico y Meteorología",
            estado: estadoFinalizada,
            fecha: "2026-07-20",
            horaInicio: "08:00",
            horaFin: "09:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        // Canceladas (fechas pasadas)
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-001",
            servicio: "Vuelo de Familiarización",
            estado: estadoCancelada,
            fecha: "2026-07-22",
            horaInicio: "10:00",
            horaFin: "10:45",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: "El cliente solicitó reprogramar la clase.",
        },
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-002",
            servicio: "Vuelo Nocturno (Night Rating)",
            estado: estadoCancelada,
            fecha: "2026-07-25",
            horaInicio: "16:00",
            horaFin: "17:30",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: "No disponible por condiciones meteorológicas.",
        },
        // Pendientes
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-001",
            servicio: "Vuelo de Familiarización",
            estado: estadoPendiente,
            fecha: "2026-09-08",
            horaInicio: "08:00",
            horaFin: "08:45",
            adicionales: ["Fotos aéreas del vuelo", "Video del vuelo"],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-001",
            servicio: "Navegación Visual (Cross-Country VFR)",
            estado: estadoPendiente,
            fecha: "2026-09-09",
            horaInicio: "10:00",
            horaFin: "12:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-002",
            servicio: "Introducción al Vuelo Instrumental (IFR Basics)",
            estado: estadoPendiente,
            fecha: "2026-09-10",
            horaInicio: "13:00",
            horaFin: "14:30",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-003",
            servicio: "Preparación para Examen de Piloto Privado (Checkride Prep)",
            estado: estadoPendiente,
            fecha: "2026-09-11",
            horaInicio: "09:00",
            horaFin: "11:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        // Confirmadas
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-001",
            servicio: "Curso de Piloto Privado (PPL) - Módulo práctico",
            estado: estadoConfirmada,
            fecha: "2026-09-16",
            horaInicio: "08:00",
            horaFin: "09:30",
            adicionales: ["Certificado de horas de vuelo"],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-002",
            servicio: "Vuelo Nocturno (Night Rating)",
            estado: estadoConfirmada,
            fecha: "2026-09-17",
            horaInicio: "15:00",
            horaFin: "16:30",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "jorge.perez@hotmail.com",
            empleado: "EMP-003",
            servicio: "Factores Humanos y Seguridad Operacional (CRM)",
            estado: estadoConfirmada,
            fecha: "2026-09-21",
            horaInicio: "08:00",
            horaFin: "09:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
        {
            cliente: "maria.lopez@gmail.com",
            empleado: "EMP-002",
            servicio: "Maniobras de Emergencia y Pérdida de Sustentación (Stall Recovery)",
            estado: estadoConfirmada,
            fecha: "2026-09-24",
            horaInicio: "09:00",
            horaFin: "10:00",
            adicionales: [],
            observaciones: null,
            motivoCancelacion: null,
        },
    ];

    for (const cita of citasData) {
        const cliente = await prisma.usuario.findUniqueOrThrow({
            where: { correo: cita.cliente },
        });
        const empleado = await prisma.empleado.findUniqueOrThrow({
            where: { codigoEmpleado: cita.empleado },
        });
        const servicio = await prisma.servicio.findUniqueOrThrow({
            where: { nombre: cita.servicio },
        });

        const adicionalesRegistrados = await Promise.all(
            cita.adicionales.map(async (nombre) => {
                const adicional = await prisma.servicioAdicional.findUniqueOrThrow({
                    where: { nombre },
                });
                return adicional;
            })
        );

        const precioServicio = Number(servicio.precioBase);
        const costoAdicionales = adicionalesRegistrados.reduce(
            (total, adicional) => total + Number(adicional.precio),
            0
        );
        const existe = await prisma.cita.findFirst({
            where: {
                empleadoId: empleado.id,
                fecha: toDate(cita.fecha),
                horaInicio: toTime(cita.horaInicio),
            },
        });
        if (existe) {
            continue;
        }

        await prisma.cita.create({
            data: {
                clienteId: cliente.id,
                empleadoId: empleado.id,
                servicioId: servicio.id,
                estadoCitaId: cita.estado.id,
                creadoPorUsuarioId: admin.id,
                fecha: toDate(cita.fecha),
                horaInicio: toTime(cita.horaInicio),
                horaFin: toTime(cita.horaFin),
                duracionMinutos: servicio.duracionMinutos,
                precioServicio,
                costoAdicionales,
                costoTotal: precioServicio + costoAdicionales,
                observaciones: cita.observaciones,
                motivoCancelacion: cita.motivoCancelacion,
                adicionales: {
                    connect: adicionalesRegistrados.map((adicional) => ({
                        id: adicional.id,
                    })),
                },
            },
        });
    }

    console.log("Seed de Envol Académie ejecutado correctamente.");
}

main()
    .catch((e) => {
        console.error("Error en seed:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
