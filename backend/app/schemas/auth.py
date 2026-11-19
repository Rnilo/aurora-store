"""DTOs de autenticacion y direcciones."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegistroEntrada(BaseModel):
    nombre: str = Field(min_length=2, max_length=120)
    correo: EmailStr
    contrasena: str = Field(min_length=8, max_length=72)
    telefono: str | None = Field(default=None, max_length=30)


class SesionEntrada(BaseModel):
    correo: EmailStr
    contrasena: str = Field(min_length=1, max_length=72)


class UsuarioRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    correo: EmailStr
    telefono: str | None
    creado_en: datetime


class TokenRespuesta(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioRespuesta


class DireccionEntrada(BaseModel):
    alias: str = Field(default="Casa", max_length=60)
    calle: str = Field(min_length=3, max_length=160)
    numero: str = Field(min_length=1, max_length=20)
    departamento: str | None = Field(default=None, max_length=40)
    comuna: str = Field(min_length=2, max_length=80)
    ciudad: str = Field(min_length=2, max_length=80)
    region: str = Field(min_length=2, max_length=80)
    codigo_postal: str | None = Field(default=None, max_length=20)
    predeterminada: bool = False


class DireccionRespuesta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    alias: str
    calle: str
    numero: str
    departamento: str | None
    comuna: str
    ciudad: str
    region: str
    codigo_postal: str | None
    predeterminada: bool
