from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.config.database import get_db
from app.models.paciente import Paciente
from app.schemas.paciente import PacienteIn, PacienteOut

router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)

# ✅ LISTAR TODOS LOS PACIENTES
@router.get("/", response_model=List[PacienteOut])
async def listar_pacientes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Paciente))
    pacientes = result.scalars().all()
    return pacientes


# ✅ OBTENER PACIENTE POR ID
@router.get("/{id_paciente}", response_model=PacienteOut)
async def obtener_paciente(id_paciente: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Paciente).where(Paciente.id_paciente == id_paciente)
    )
    paciente = result.scalar_one_or_none()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente


# ✅ CREAR PACIENTE
@router.post("/", response_model=PacienteOut)
async def crear_paciente(datos: PacienteIn, db: AsyncSession = Depends(get_db)):
    data = datos.model_dump()
    nuevo_paciente = Paciente(**data)
    db.add(nuevo_paciente)
    await db.commit()
    await db.refresh(nuevo_paciente)
    return nuevo_paciente


# ✅ ACTUALIZAR PACIENTE
@router.put("/{id_paciente}", response_model=PacienteOut)
async def actualizar_paciente(
    id_paciente: int, datos: PacienteIn, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Paciente).where(Paciente.id_paciente == id_paciente)
    )
    paciente = result.scalar_one_or_none()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    for key, value in datos.dict().items():
        setattr(paciente, key, value)

    await db.commit()
    await db.refresh(paciente)
    return paciente


# ✅ ELIMINAR PACIENTE
@router.delete("/{id_paciente}")
async def eliminar_paciente(id_paciente: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Paciente).where(Paciente.id_paciente == id_paciente)
    )
    paciente = result.scalar_one_or_none()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    await db.delete(paciente)
    await db.commit()
    return {"message": "Paciente eliminado correctamente"}
