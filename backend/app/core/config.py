"""Configuracion central del backend (pydantic-settings)."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Ajustes(BaseSettings):
    """Variables de entorno del servicio. Los nombres de campo coinciden en
    mayusculas con el entorno (DB_HOST, SECRETO_JWT, ...)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    nombre_app: str = "Aurora Store API"
    version: str = "1.0.0"

    db_user: str = "postgres"
    db_password: str = "postgres"
    db_host: str = "localhost"
    db_port: int = 5433
    db_name: str = "aurora_store"

    secreto_jwt: str = "cambia-este-secreto-en-produccion"
    algoritmo_jwt: str = "HS256"
    token_expira_minutos: int = 1440

    allowed_origins: str = "http://localhost:4200,http://localhost:8080"

    redis_url: str = "redis://127.0.0.1:6380/0"
    limite_tasa_habilitado: bool = True
    limite_tasa_max_peticiones: int = 120
    limite_tasa_ventana_segundos: int = 60

    @property
    def url_base_datos(self) -> str:
        return (
            f"postgresql+psycopg2://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def origenes_permitidos(self) -> list[str]:
        return [origen.strip() for origen in self.allowed_origins.split(",") if origen.strip()]


@lru_cache
def obtener_ajustes() -> Ajustes:
    return Ajustes()


ajustes = obtener_ajustes()
