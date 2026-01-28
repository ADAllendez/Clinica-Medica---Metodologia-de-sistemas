from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TurnoIn(BaseModel):
    id_paciente: int
    id_medico: Optional[int] = None
    fecha_turno: datetime
    estado: str

class TurnoOut(TurnoIn):
    id_turno: int

    class Config:
        from_attributes = True