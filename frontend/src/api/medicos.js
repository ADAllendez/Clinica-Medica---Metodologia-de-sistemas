import api from "./client";

export async function getMedicos() {
  const res = await api.get("/medicos");
  return res.data;
}

export async function crearMedico(data) {
  const res = await api.post("/medicos", data);
  return res.data;
}

export async function actualizarMedico(id, data) {
  const res = await api.put(`/medicos/${id}`, data);
  return res.data;
}

export async function eliminarMedico(id) {
  const res = await api.delete(`/medicos/${id}`);
  return res.data;
}
