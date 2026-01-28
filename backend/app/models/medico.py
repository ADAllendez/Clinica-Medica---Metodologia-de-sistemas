from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models import Base

class Medico(Base):
    __tablename__ = "medico"

    id_medico = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    matricula = Column(String(50), unique=True, nullable=False)
    id_especialidad = Column(
        Integer,
        ForeignKey("especialidad.id_especialidad", ondelete="SET NULL", onupdate="CASCADE")
    )

    especialidad = relationship("Especialidad", backref="medicos")
    turnos = relationship("Turno", back_populates="medico")