from pydantic import BaseModel

class EspecialidadIn(BaseModel):
    nombre:str

class EspecialidadOut(EspecialidadIn):
    id_especialidad: int
    
    class Config:
        from_attributes = True