import { useEffect, useState } from "react";
import { crearTurno, actualizarTurno } from "../api/turnos";
import { getPacientes } from "../api/pacientes";
import { getMedicos } from "../api/medicos";
import { getEspecialidades } from "../api/especialidades";
import Layout from "../components/Layout";

function TurnosPage() {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");

  const [form, setForm] = useState({
    id_turno: null,
    id_paciente: "",
    id_medico: "",
    fecha_turno: "",
    estado: "Programado",
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  async function cargarDatos() {
    //ahora traemos pacientes, médicos y especialidades juntos
    const [ps, ms, esps] = await Promise.all([
      getPacientes(),
      getMedicos(),
      getEspecialidades(),
    ]);
    setPacientes(ps);
    setMedicos(ms);
    setEspecialidades(esps);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      id_paciente: Number(form.id_paciente),
      id_medico: form.id_medico ? Number(form.id_medico) : null,
      fecha_turno: form.fecha_turno,
      estado: form.estado,
    };

    if (modoEdicion && form.id_turno) {
      await actualizarTurno(form.id_turno, payload);
    } else {
      await crearTurno(payload);
    }

    setForm({
      id_turno: null,
      id_paciente: "",
      id_medico: "",
      fecha_turno: "",
      estado: "Programado",
    });
    setModoEdicion(false);
    setEspecialidadSeleccionada("");
  }

  //Médicos filtrados por especialidad
  const medicosFiltrados =
    especialidadSeleccionada === ""
      ? medicos
      : medicos.filter(
          (m) => m.id_especialidad === Number(especialidadSeleccionada)
        );

  return (
    <Layout current="turnos">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 md:text-3xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              📅
            </span>
            Nuevo Turno
          </h1>
          <p className="text-sm text-slate-500">
            Completá los datos para registrar un nuevo turno.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModoEdicion(false);
            setForm({
              id_turno: null,
              id_paciente: "",
              id_medico: "",
              fecha_turno: "",
              estado: "Programado",
            });
            setEspecialidadSeleccionada("");
          }}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ⬅ Limpiar formulario
        </button>
      </div>

      {}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-md">
        {}
        <div className="flex items-center gap-2 bg-blue-600 px-5 py-3 text-white">
          <span>✏️</span>
          <h2 className="font-semibold">Datos del Turno</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-4">
          {/* Paciente / Médico */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Paciente */}
            <div className="rounded-lg border bg-slate-50 p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  👤
                </span>
                Paciente <span className="text-red-500">*</span>
              </h3>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Seleccione un paciente
              </label>
              <select
                name="id_paciente"
                value={form.id_paciente}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Seleccionar paciente --</option>
                {pacientes.map((p) => (
                  <option key={p.id_paciente} value={p.id_paciente}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
            </div>

            {/* Especialidad + Médico */}
            <div className="rounded-lg border bg-slate-50 p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  🩺
                </span>
                Médico <span className="text-red-500">*</span>
              </h3>

              {/* Especialidad */}
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Especialidad
                </label>
                <select
                  value={especialidadSeleccionada}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEspecialidadSeleccionada(value);
                    // cuando cambio la especialidad, limpio el médico seleccionado
                    setForm((prev) => ({ ...prev, id_medico: "" }));
                  }}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Seleccionar especialidad --</option>
                  {especialidades.map((esp) => (
                    <option
                      key={esp.id_especialidad}
                      value={esp.id_especialidad}
                    >
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Médico, filtrado por especialidad */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Seleccione un médico
                </label>
                <select
                  name="id_medico"
                  value={form.id_medico}
                  onChange={handleChange}
                  required
                  disabled={medicosFiltrados.length === 0}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">
                    {especialidadSeleccionada === ""
                      ? "-- Primero elija una especialidad --"
                      : medicosFiltrados.length === 0
                      ? "No hay médicos para esa especialidad"
                      : "-- Seleccionar médico --"}
                  </option>
                  {medicosFiltrados.map((m) => (
                    <option key={m.id_medico} value={m.id_medico}>
                      {m.nombre} {m.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fecha / Hora / Estado */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Fecha */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_turno"
                value={form.fecha_turno.split("T")[0] || ""}
                onChange={(e) => {
                  const fecha = e.target.value;
                  const hora = form.fecha_turno.split("T")[1] || "09:00";
                  setForm({
                    ...form,
                    fecha_turno: `${fecha}T${hora}`,
                  });
                }}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                La fecha debe ser futura.
              </p>
            </div>

            {/* Hora */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="hora"
                value={form.fecha_turno ? form.fecha_turno.slice(11, 16) : ""}
                onChange={(e) => {
                  const hora = e.target.value;
                  const fecha =
                    form.fecha_turno.split("T")[0] ||
                    new Date().toISOString().slice(0, 10);
                  setForm({
                    ...form,
                    fecha_turno: `${fecha}T${hora}`,
                  });
                }}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Formato 24 horas (Ej: 14:30)
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Programado">Programado</option>
                <option value="Atendiendo">Atendiendo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Botón Crear / Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ✅ {modoEdicion ? "Guardar cambios" : "Crear Turno"}
            </button>
          </div>
        </form>
      </div>

      {/* Panel de ayuda */}
      <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-md">
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          💡 Ayuda
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Los campos marcados con * son obligatorios.</li>
          <li>El paciente y el médico deben estar cargados en el sistema.</li>
          <li>Revisá el horario del médico antes de asignar el turno.</li>
          <li>Los turnos se programan en horarios definidos por la clínica.</li>
        </ul>
      </div>
    </Layout>
  );
}

export default TurnosPage;
