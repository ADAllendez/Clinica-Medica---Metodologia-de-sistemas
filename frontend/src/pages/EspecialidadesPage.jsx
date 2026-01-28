// src/pages/EspecialidadesPage.js
import { useEffect, useState } from "react";
import {
  getEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
} from "../api/especialidades";

function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [form, setForm] = useState({
    id_especialidad: null,
    nombre: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  async function cargarEspecialidades() {
    const data = await getEspecialidades();
    setEspecialidades(data);
  }

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = { nombre: form.nombre };

    if (modoEdicion && form.id_especialidad) {
      await actualizarEspecialidad(form.id_especialidad, payload);
    } else {
      await crearEspecialidad(payload);
    }

    setForm({ id_especialidad: null, nombre: "" });
    setModoEdicion(false);
    await cargarEspecialidades();
  }

  function editarEspecialidad(esp) {
    setForm({
      id_especialidad: esp.id_especialidad,
      nombre: esp.nombre,
    });
    setModoEdicion(true);
  }

  async function borrarEspecialidad(id) {
    if (window.confirm("¿Seguro que querés eliminar esta especialidad?")) {
      await eliminarEspecialidad(id);
      await cargarEspecialidades();
    }
  }

  return (
    <div>
      <h2>Especialidades</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>Nombre: </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          {modoEdicion ? "Guardar cambios" : "Crear especialidad"}
        </button>
        {modoEdicion && (
          <button
            type="button"
            onClick={() => {
              setForm({ id_especialidad: null, nombre: "" });
              setModoEdicion(false);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {especialidades.map((e) => (
            <tr key={e.id_especialidad}>
              <td>{e.id_especialidad}</td>
              <td>{e.nombre}</td>
              <td>
                <button onClick={() => editarEspecialidad(e)}>Editar</button>
                <button
                  onClick={() => borrarEspecialidad(e.id_especialidad)}
                  style={{ marginLeft: "5px" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {especialidades.length === 0 && (
            <tr>
              <td colSpan="3">No hay especialidades cargadas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EspecialidadesPage;
