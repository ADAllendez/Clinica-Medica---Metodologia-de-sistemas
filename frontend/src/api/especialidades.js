import api from "./client";

export async function getEspecialidades() {
  const res = await api.get("/especialidades");
  return res.data;
}
export async function crearEspecialidad(especialidad) {
  const res = await api.post("/especialidades", especialidad);
  return res.data;
}

export async function actualizarEspecialidad(id, especialidad) {
  const res = await api.put(`/especialidades/${id}`, especialidad);
  return res.data;
}

export async function eliminarEspecialidad(id) {
  const res = await api.delete(`/especialidades/${id}`);
  return res.data;
}

