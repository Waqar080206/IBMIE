# reset_db.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import get_settings
from app.database.models import Base

async def reset():
    settings = get_settings()
    # Replace with your async database URL configuration if different
    engine = create_async_engine(settings.SUPABASE_DATABASE_URI, echo=True)
    
    async with engine.begin() as conn:
        print("Dropping existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating normalized tables...")
        await conn.run_sync(Base.metadata.create_all)
    print("Database synced successfully!")

if __name__ == "__main__":
    asyncio.run(reset())