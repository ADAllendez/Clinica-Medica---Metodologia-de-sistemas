from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models import Base

class Turno(Base):
    __tablename__ = "turnos"

    id_turno = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("paciente.id_paciente"))
    id_medico = Column(Integer, ForeignKey("medico.id_medico"))
    fecha_turno = Column(DateTime, nullable=False)
    estado = Column(String(50), nullable=False)  

    paciente = relationship("Paciente", back_populates="turnos")
    medico = relationship("Medico", back_populates="turnos")