import React, { useEffect, useState } from "react";
import {
  getPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../api/pacientes";
import Layout from "../components/Layout";

const emptyForm = {
  id_paciente: null,
  nombre: "",
  apellido: "",
  dni: "",
  correo: "",
};

function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarPacientes();
  }, []);

  async function cargarPacientes() {
    try {
      setCargando(true);
      setError("");
      const data = await getPacientes();
      setPacientes(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pacientes.");
    } finally {
      setCargando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni || null,
      correo: form.correo || null,
    };

    try {
      setError("");

      if (modoEdicion && form.id_paciente) {
        await actualizarPaciente(form.id_paciente, payload);
      } else {
        await crearPaciente(payload);
      }

      await cargarPacientes();
      setForm(emptyForm);
      setModoEdicion(false);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el paciente.");
    }
  }

  function editarPaciente(paciente) {
    setModoEdicion(true);
    setForm({
      id_paciente: paciente.id_paciente,
      nombre: paciente.nombre || "",
      apellido: paciente.apellido || "",
      dni: paciente.dni || "",
      correo: paciente.correo || "",
    });
  }

  async function borrarPaciente(id) {
    const ok = window.confirm("¿Seguro que querés eliminar este paciente?");
    if (!ok) return;

    try {
      setError("");
      await eliminarPaciente(id);
      await cargarPacientes();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el paciente.");
    }
  }

  function limpiarFormulario() {
    setForm(emptyForm);
    setModoEdicion(false);
  }

  const pacientesFiltrados = pacientes.filter((p) => {
    const term = busqueda.toLowerCase();
    const texto = `${p.nombre ?? ""} ${p.apellido ?? ""} ${
      p.dni ?? ""
    }`.toLowerCase();
    return texto.includes(term);
  });

  return (
    <Layout active="pacientes">
      <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Gestión de Pacientes
          </h1>
          <p className="text-sm text-slate-500">
            Alta, edición, búsqueda y eliminación de pacientes del sistema.
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {cargando && (
          <div className="mb-4 text-sm text-slate-500">
            Cargando pacientes...
          </div>
        )}

        {/* Contenido principal: tabla + formulario */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Tabla de pacientes (2/3) */}
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700">
                Pacientes registrados
              </h2>
              <span className="text-xs text-slate-500">
                Total: {pacientes.length}
              </span>
            </div>

            {/* Filtro de búsqueda */}
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
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
                      DNI
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Correo
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {pacientesFiltrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-sm text-slate-500"
                      >
                        No hay pacientes para mostrar.
                      </td>
                    </tr>
                  ) : (
                    pacientesFiltrados.map((p) => (
                      <tr key={p.id_paciente}>
                        <td className="px-4 py-2 text-xs text-slate-500">
                          #{p.id_paciente}
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium text-slate-800">
                            {p.nombre} {p.apellido}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-600">
                          {p.dni || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-600">
                          {p.correo || "-"}
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          <button
                            onClick={() => editarPaciente(p)}
                            className="mr-2 rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-blue-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => borrarPaciente(p.id_paciente)}
                            className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white shadow hover:bg-red-600"
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

          {/* Formulario (1/3) */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-1 text-lg font-semibold text-slate-700">
              {modoEdicion ? "Editar paciente" : "Nuevo paciente"}
            </h2>
            <p className="mb-4 text-xs text-slate-500">
              Completá los datos y guardá para registrar o actualizar un
              paciente.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  DNI
                </label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {modoEdicion && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                >
                  {modoEdicion ? "Guardar cambios" : "Crear paciente"}
                </button>
              </div>
            </form>

            <div className="mt-4 rounded-md bg-slate-50 p-3">
              <p className="mb-1 text-xs font-semibold text-slate-600">
                Ayuda
              </p>
              <ul className="list-disc pl-4 text-[11px] text-slate-500">
                <li>El nombre y apellido son obligatorios.</li>
                <li>El DNI y el correo son opcionales, pero recomendados.</li>
                <li>
                  Podés editar un paciente desde la tabla de la izquierda.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PacientesPage;
