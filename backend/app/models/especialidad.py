from sqlalchemy import Column,Integer,String
from app.models import Base

class Especialidad (Base):
    __tablename__ = "especialidad"

    id_especialidad = Column(Integer,primary_key=True, index = True)
    nombre = Column(String(100),nullable= False)