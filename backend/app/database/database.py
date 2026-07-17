from __future__ import annotations

import os
import ssl
from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool  # <--- Added to disable SQLAlchemy's pool

from app.core.config import get_settings
from app.database.models import Base

settings = get_settings()


def _build_database_url(raw_url: str) -> str:
    if raw_url.startswith("postgresql+asyncpg://"):
        return raw_url
    if raw_url.startswith("postgresql://"):
        return raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if raw_url.startswith("postgres://"):
        return raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
    return raw_url


DATABASE_URL = _build_database_url(settings.supabase_database_uri)


def _build_ssl_context() -> ssl.SSLContext:
    ssl_context = ssl.create_default_context()
    ssl_verify = os.getenv("SUPABASE_DB_SSL_VERIFY", "true").lower()
    if ssl_verify in {"0", "false", "no"}:
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
    return ssl_context


# Create the updated engine configuration
engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    # 1. NullPool delegates all connection pooling to PgBouncer.
    # We remove pool_pre_ping=True here because NullPool doesn't use ping tests.
    poolclass=NullPool, 
    connect_args={
        "ssl": _build_ssl_context(),
        # 2. We turn off statement caches entirely inside asyncpg
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
    },
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session