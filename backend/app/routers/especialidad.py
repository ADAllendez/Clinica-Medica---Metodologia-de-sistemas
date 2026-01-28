from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.config.database import get_db
from app.models.especialidad import Especialidad
from app.schemas.especialidad import EspecialidadIn, EspecialidadOut

router = APIRouter(prefix="/especialidades", tags=["Especialidades"])

# obtener las especialidades
@router.get("/", response_model=list[EspecialidadOut])
async def listar_especialidades(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Especialidad))
    return result.scalars().all()

# obtener la especialidad por ID
@router.get("/{id_especialidad}", response_model=EspecialidadOut)
async def obtener_especialida(id_especialidad: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Especialidad).where(Especialidad.id_especialidad == id_especialidad)
    )
    especialidad = result.scalar_one_or_none()
    if not especialidad:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    return especialidad

# Crear una especialidad nueva
@router.post("/", response_model=EspecialidadOut)
async def crear_especialidad(datos: EspecialidadIn, db: AsyncSession = Depends(get_db)):
    nueva_especialidad = Especialidad(**datos.dict())
    db.add(nueva_especialidad)
    await db.commit()
    await db.refresh(nueva_especialidad)
    return nueva_especialidad

# actualizar una especialidad en particular
@router.put("/{id_especialidad}", response_model=EspecialidadOut)
async def actulizar_especialidad(
    id_especialidad: int, datos: EspecialidadIn, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Especialidad).where(Especialidad.id_especialidad == id_especialidad)
    )
    especialidad = result.scalar_one_or_none()
    if not especialidad:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    especialidad.nombre = datos.nombre
    await db.commit()
    await db.refresh(especialidad)
    return especialidad

# eliminar especialidad
@router.delete("/{id_especialidad}")
async def eliminar_especialidad(id_especialidad: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Especialidad).where(Especialidad.id_especialidad == id_especialidad)
    )
    especialidad = result.scalar_one_or_none()
    if not especialidad:
        raise HTTPException(status_code=404, detail="Especialidad no encontrada")
    await db.delete(especialidad)
    await db.commit()
    return {"message": "Especialidad eliminada correctamente"}
