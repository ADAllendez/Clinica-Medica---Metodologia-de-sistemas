from pydantic import BaseModel
from typing import Optional

class MedicoIn(BaseModel):
    nombre: str
    apellido: str
    matricula: str
    id_especialidad: Optional[int] = None


class MedicoOut(MedicoIn):
    id_medico: int

    class Config:
        from_attributes = True
