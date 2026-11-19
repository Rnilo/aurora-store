"""Motor SQLAlchemy, sesion y base declarativa."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import ajustes

motor = create_engine(ajustes.url_base_datos, pool_pre_ping=True, future=True)
SesionLocal = sessionmaker(bind=motor, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    sesion = SesionLocal()
    try:
        yield sesion
    finally:
        sesion.close()
