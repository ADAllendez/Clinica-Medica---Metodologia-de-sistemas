import api from "./client";

export async function getPacientes() {
  const res = await api.get("/pacientes");
  return res.data;
}

export async function getPaciente(id) {
  const res = await api.get(`/pacientes/${id}`);
  return res.data;
}

export async function crearPaciente(paciente) {
  const res = await api.post("/pacientes", paciente);
  return res.data;
}

export async function actualizarPaciente(id, paciente) {
  const res = await api.put(`/pacientes/${id}`, paciente);
  return res.data;
}

export async function eliminarPaciente(id) {
  const res = await api.delete(`/pacientes/${id}`);
  return res.data;
}
