from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.config.database import get_db
from app.models.medico import Medico
from app.models.especialidad import Especialidad
from app.schemas.medico import MedicoIn, MedicoOut

router = APIRouter(prefix="/medicos", tags=["Medicos"])

# obtener lista de medicos
@router.get("/", response_model=list[MedicoOut])
async def listar_medicos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medico))
    return result.scalars().all()

# obtener medico por ID
@router.get("/{id_medico}", response_model=MedicoOut)
async def obtener_medico(id_medico: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medico).where(Medico.id_medico == id_medico))
    medico = result.scalar_one_or_none()
    if not medico:
        raise HTTPException(status_code=404, detail="Medico no encontrado")
    return medico

# crear medico
@router.post("/", response_model=MedicoOut)
async def crear_medico(datos: MedicoIn, db: AsyncSession = Depends(get_db)):
    # Verificamos si la especialidad existe (si fue enviada)
    if datos.id_especialidad:
        result = await db.execute(
            select(Especialidad).where(Especialidad.id_especialidad == datos.id_especialidad)
        )
        especialidad = result.scalar_one_or_none()
        if not especialidad:
            raise HTTPException(status_code=400, detail="Especialidad no valida")
    nuevo_medico = Medico(**datos.dict())
    db.add(nuevo_medico)
    await db.commit()
    await db.refresh(nuevo_medico)
    return nuevo_medico

# actualizamos a un medico 
@router.put("/{id_medico}", response_model=MedicoOut)
async def actualizar_medico(id_medico: int, datos: MedicoIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medico).where(Medico.id_medico == id_medico))
    medico = result.scalar_one_or_none()
    if not medico:
        raise HTTPException(status_code=404, detail="Medico no encontrado")
    
    for key, value in datos.dict().items():
        setattr(medico, key, value)

    await db.commit()
    await db.refresh(medico)
    return medico

# eliminar medico
@router.delete("/{id_medico}")
async def eliminar_medico(id_medico: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medico).where(Medico.id_medico == id_medico))
    medico = result.scalar_one_or_none()
    if not medico:
        raise HTTPException(status_code=404, detail="Medico no encontrado")
    await db.delete(medico)
    await db.commit()
    return {"message": "Medico eliminado correctamente"}
