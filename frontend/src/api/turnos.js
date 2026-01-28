import api from "./client";

export async function getTurnos() {
  const res = await api.get("/turnos");
  return res.data;
}

export async function crearTurno(data) {
  const res = await api.post("/turnos", data);
  return res.data;
}

export async function actualizarTurno(id, data) {
  const res = await api.put(`/turnos/${id}`, data);
  return res.data;
}

export async function eliminarTurno(id) {
  const res = await api.delete(`/turnos/${id}`);
  return res.data;
}
