from pydantic import BaseModel
from typing import Optional

class PacienteBase(BaseModel):
    nombre: str
    apellido: str
    dni: Optional[str] = None
    correo: Optional[str] = None

class PacienteIn(PacienteBase):
    pass

class PacienteOut(PacienteBase):
    id_paciente: int

    class Config:
        from_attributes = True
