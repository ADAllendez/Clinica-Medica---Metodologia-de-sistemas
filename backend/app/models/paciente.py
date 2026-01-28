from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models import Base

class Paciente(Base):
    __tablename__ = "paciente"

    id_paciente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    apellido = Column(String(100))
    dni = Column(String(20))
    correo = Column(String(100))
    
    turnos = relationship("Turno", back_populates="paciente")