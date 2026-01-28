import { useEffect, useState } from "react";
import {
  getMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
} from "../api/medicos";
import { getEspecialidades } from "../api/especialidades";
import Layout from "../components/Layout";

function MedicosPage() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState({
    id_medico: null,
    nombre: "",
    apellido: "",
    matricula: "",
    id_especialidad: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  async function cargarDatos() {
    const [meds, esps] = await Promise.all([
      getMedicos(),
      getEspecialidades(),
    ]);
    setMedicos(meds);
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
      nombre: form.nombre,
      apellido: form.apellido,
      matricula: form.matricula,
      id_especialidad: form.id_especialidad
        ? Number(form.id_especialidad)
        : null,
    };

    if (modoEdicion && form.id_medico) {
      await actualizarMedico(form.id_medico, payload);
    } else {
      await crearMedico(payload);
    }

    setForm({
      id_medico: null,
      nombre: "",
      apellido: "",
      matricula: "",
      id_especialidad: "",
    });
    setModoEdicion(false);
    await cargarDatos();
  }

  function editarMedico(m) {
    setForm({
      id_medico: m.id_medico,
      nombre: m.nombre,
      apellido: m.apellido,
      matricula: m.matricula,
      id_especialidad: m.id_especialidad || "",
    });
    setModoEdicion(true);
  }

  async function borrarMedico(id) {
    if (window.confirm("¿Seguro que querés eliminar este médico?")) {
      await eliminarMedico(id);
      await cargarDatos();
    }
  }

  function nombreEspecialidad(id_especialidad) {
    const esp = especialidades.find(
      (e) => e.id_especialidad === id_especialidad
    );
    return esp ? esp.nombre : "";
  }

  return (
    <Layout active="medicos">
      <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
        {/* Encabezado */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                🩺
              </span>
              Médicos
            </h1>
            <p className="text-sm text-slate-500">
              Gestioná el listado de médicos y sus especialidades.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            {modoEdicion ? "Editar médico" : "Nuevo médico"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3 md:grid-cols-2 md:gap-4"
          >
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-slate-600">
                Nombre
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-slate-600">
                Apellido
              </label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-slate-600">
                Matrícula
              </label>
              <input
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-slate-600">
                Especialidad
              </label>
              <select
                name="id_especialidad"
                value={form.id_especialidad}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Sin especialidad --</option>
                {especialidades.map((e) => (
                  <option key={e.id_especialidad} value={e.id_especialidad}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 flex gap-2 md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                {modoEdicion ? "Guardar cambios" : "Crear médico"}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  onClick={() => {
                    setModoEdicion(false);
                    setForm({
                      id_medico: null,
                      nombre: "",
                      apellido: "",
                      matricula: "",
                      id_especialidad: "",
                    });
                  }}
                  className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de médicos */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Médicos registrados
            </h2>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {medicos.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Apellido
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Matrícula
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Especialidad
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {medicos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-sm text-slate-500"
                    >
                      No hay médicos cargados.
                    </td>
                  </tr>
                ) : (
                  medicos.map((m) => (
                    <tr key={m.id_medico}>
                      <td className="px-4 py-2 text-xs text-slate-600">
                        {m.id_medico}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        {m.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        {m.apellido}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        {m.matricula}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-700">
                        {nombreEspecialidad(m.id_especialidad)}
                      </td>
                      <td className="px-4 py-2 text-right text-xs">
                        <button
                          onClick={() => editarMedico(m)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => borrarMedico(m.id_medico)}
                          className="ml-2 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MedicosPage;
