// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getTurnos } from "../api/turnos";
import { getPacientes } from "../api/pacientes";
import { getMedicos } from "../api/medicos";

// Helpers de formato
function formatearFecha(fechaStr) {
  if (!fechaStr) return "-";
  const d = new Date(fechaStr);
  if (Number.isNaN(d.getTime())) return fechaStr;
  return d.toLocaleDateString("es-AR");
}

function formatearHora(fechaStr) {
  if (!fechaStr) return "-";
  const d = new Date(fechaStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HomePage() {
  const [turnos, setTurnos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // filtros
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [busquedaPaciente, setBusquedaPaciente] = useState("");

  // turno seleccionado para el comprobante
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [ts, ps, ms] = await Promise.all([
        getTurnos(),
        getPacientes(),
        getMedicos(),
      ]);
      setTurnos(ts);
      setPacientes(ps);
      setMedicos(ms);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos de turnos.");
    } finally {
      setCargando(false);
    }
  }

  const turnosEnriquecidos = turnos.map((t) => {
    const paciente = pacientes.find((p) => p.id_paciente === t.id_paciente);
    const medico = medicos.find((m) => m.id_medico === t.id_medico);

    return {
      ...t,
      nombrePaciente: paciente
        ? `${paciente.nombre} ${paciente.apellido}`
        : "Sin asignar",
      dniPaciente: paciente?.dni ?? "",
      nombreMedico: medico
        ? `${medico.nombre} ${medico.apellido}`
        : "Sin asignar",
      especialidad: medico?.especialidad ?? "",
    };
  });

  const turnosFiltrados = turnosEnriquecidos.filter((t) => {
    let ok = true;

    if (fechaFiltro) {
      const fechaTurno = new Date(t.fecha_turno);
      const fechaInput = new Date(fechaFiltro);
      const mismoDia =
        fechaTurno.getFullYear() === fechaInput.getFullYear() &&
        fechaTurno.getMonth() === fechaInput.getMonth() &&
        fechaTurno.getDate() === fechaInput.getDate();
      if (!mismoDia) ok = false;
    }

    if (estadoFiltro !== "Todos" && t.estado !== estadoFiltro) {
      ok = false;
    }

    if (busquedaPaciente.trim() !== "") {
      const term = busquedaPaciente.toLowerCase();
      const texto = `${t.nombrePaciente} ${t.dniPaciente}`.toLowerCase();
      if (!texto.includes(term)) ok = false;
    }

    return ok;
  });

  function abrirDetalle(turno) {
    setTurnoSeleccionado(turno);
  }

  function cerrarDetalle() {
    setTurnoSeleccionado(null);
  }

  function imprimirDetalle() {
    window.print();
  }

  return (
    <Layout current="dashboard">
      <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
        {/* Encabezado */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                📅
              </span>
              Turnos Activos
            </h1>
            <p className="text-sm text-slate-500">
              Visualizá y filtrá los turnos registrados en la clínica.
            </p>
          </div>

          <button
            onClick={cargarDatos}
            className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 md:mt-0"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="mb-4 grid gap-3 rounded-lg bg-white p-4 shadow md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Fecha
            </label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Estado
            </label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Todos">Todos</option>
              <option value="Programado">Programado</option>
              <option value="Atendiendo">Atendiendo</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Buscar Paciente (nombre o DNI)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Ramírez, 34567890..."
                value={busquedaPaciente}
                onChange={(e) => setBusquedaPaciente(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setBusquedaPaciente("")}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Card de Turnos Registrados */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-sm text-white">
                📋
              </span>
              <h2 className="text-sm font-semibold text-slate-700">
                Turnos Registrados
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {turnosFiltrados.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mostrando {turnosFiltrados.length} de {turnos.length} turnos.
            </p>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Hora
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Paciente
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Médico
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Estado
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cargando ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-sm text-slate-500"
                    >
                      Cargando turnos...
                    </td>
                  </tr>
                ) : turnosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-sm text-slate-500"
                    >
                      No hay turnos para mostrar con los filtros actuales.
                    </td>
                  </tr>
                ) : (
                  turnosFiltrados.map((t) => (
                    <tr key={t.id_turno}>
                      <td className="px-4 py-2 text-xs text-slate-600">
                        {formatearFecha(t.fecha_turno)}
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-600">
                        {formatearHora(t.fecha_turno)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-slate-800">
                          {t.nombrePaciente}
                        </div>
                        {t.dniPaciente && (
                          <div className="text-xs text-slate-500">
                            DNI: {t.dniPaciente}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        {t.nombreMedico}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            t.estado === "Atendiendo"
                              ? "bg-emerald-100 text-emerald-700"
                              : t.estado === "Finalizado"
                              ? "bg-slate-200 text-slate-700"
                              : t.estado === "Cancelado"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {t.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-xs">
                        <button
                          onClick={() => abrirDetalle(t)}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de comprobante */}
        {turnoSeleccionado && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">
                    Comprobante de Turno
                  </h2>
                  <p className="text-xs text-slate-400">
                    #{turnoSeleccionado.id_turno}
                  </p>
                </div>
                <button
                  onClick={cerrarDetalle}
                  className="rounded-md px-2 text-sm text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Paciente
                  </p>
                  <p className="font-medium">
                    {turnoSeleccionado.nombrePaciente}
                  </p>
                  {turnoSeleccionado.dniPaciente && (
                    <p className="text-xs text-slate-500">
                      DNI: {turnoSeleccionado.dniPaciente}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Médico
                  </p>
                  <p className="font-medium">
                    {turnoSeleccionado.nombreMedico}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Fecha
                    </p>
                    <p>{formatearFecha(turnoSeleccionado.fecha_turno)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Hora
                    </p>
                    <p>{formatearHora(turnoSeleccionado.fecha_turno)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Estado
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      turnoSeleccionado.estado === "Atendiendo"
                        ? "bg-emerald-100 text-emerald-700"
                        : turnoSeleccionado.estado === "Finalizado"
                        ? "bg-slate-200 text-slate-700"
                        : turnoSeleccionado.estado === "Cancelado"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {turnoSeleccionado.estado}
                  </span>
                </div>

                <div className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Este comprobante es solo de uso interno del sistema de la
                  clínica.
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-between border-t px-5 py-3">
                <button
                  onClick={cerrarDetalle}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cerrar
                </button>
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Generar
                  </button>
                  <button
                    onClick={imprimirDetalle}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
