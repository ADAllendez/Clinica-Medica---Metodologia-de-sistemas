from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.config.database import get_db
from app.models.turno import Turno
from app.models.paciente import Paciente
from app.models.medico import Medico
from app.schemas.turno import TurnoIn, TurnoOut

router = APIRouter(prefix="/turnos", tags=["Turnos"])

# listar todos los turnos
@router.get("/", response_model=list[TurnoOut])
async def list_turnos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Turno))
    return result.scalars().all()

# obtener turno por ID
@router.get("/{id_turno}", response_model=TurnoOut)
async def obtener_turno(id_turno: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Turno).where(Turno.id_turno == id_turno))
    turno = result.scalar_one_or_none()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return turno

# crear turno
@router.post("/", response_model=TurnoOut)
async def crear_turno(datos: TurnoIn, db: AsyncSession = Depends(get_db)):

    # Verificar paciente
    paciente_res = await db.execute(
        select(Paciente).where(Paciente.id_paciente == datos.id_paciente)
    )
    paciente = paciente_res.scalar_one_or_none()
    if not paciente:
        raise HTTPException(status_code=400, detail="Paciente no encontrado")

    # Verificar médico (si aplica)
    if datos.id_medico:
        medico_res = await db.execute(
            select(Medico).where(Medico.id_medico == datos.id_medico)
        )
        medico = medico_res.scalar_one_or_none()
        if not medico:
            raise HTTPException(status_code=400, detail="Medico no encontrado")

    # Verificar si hay conflicto en el horario elegido
    conflicto_res = await db.execute(
        select(Turno).where(
            Turno.id_medico == datos.id_medico,
            Turno.fecha_turno == datos.fecha_turno,
            Turno.estado != "Cancelado",
        )
    )
    conflicto = conflicto_res.scalar_one_or_none()
    if conflicto:
        raise HTTPException(
            status_code=409, detail="El medico ya tiene turno a esa hora"
        )

    nuevo_turno = Turno(**datos.dict())
    db.add(nuevo_turno)
    await db.commit()
    await db.refresh(nuevo_turno)
    return nuevo_turno

# actualizar turno
@router.put("/{id_turno}", response_model=TurnoOut)
async def actualizar_turno(id_turno: int, datos: TurnoIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Turno).where(Turno.id_turno == id_turno))
    turno = result.scalar_one_or_none()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")

    for key, value in datos.dict().items():
        setattr(turno, key, value)
    await db.commit()
    await db.refresh(turno)
    return turno

# eliminar turno
@router.delete("/{id_turno}")
async def eliminar_turno(id_turno: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Turno).where(Turno.id_turno == id_turno))
    turno = result.scalar_one_or_none()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    await db.delete(turno)
    await db.commit()
    return {"message": "Turno eliminado correctamente"}

