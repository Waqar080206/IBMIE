from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import JSONResponse, HTMLResponse
from app.api.reports import router as reports_router
from app.api.prescriptions import router as prescriptions_router  # <-- Import the new router
from app.api.chat import router as chat_router
from app.core.config import get_settings
from app.core.exceptions import VitalisError
from app.core.logging import configure_logging, get_logger
from app.database.database import init_db

settings = get_settings()
configure_logging(settings.log_level)
LOGGER = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    LOGGER.info("Starting Vitalis backend")
    await init_db()
    yield
    LOGGER.info("Shutting down Vitalis backend")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(VitalisError)
async def vitalis_error_handler(_: Request, exc: VitalisError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
<!DOCTYPE html>
<html>
<head>
    <title>Vitalis Backend</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 80px auto;
            padding: 20px;
            line-height: 1.6;
            background: #f8fafc;
            color: #111827;
        }

        .card {
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }

        a {
            color: #0f766e;
            font-weight: bold;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🩺 Vitalis Backend</h1>

        <p><strong>✅ Server Status:</strong> Active</p>

        <p>
            The backend server is running successfully.
        </p>

        <p>
            Access the complete Vitalis application here:
        </p>

        <p>
            <a href="https://ibmie.vercel.app" target="_blank">
                https://ibmie.vercel.app
            </a>
        </p>

        <h3>Available Features</h3>

        <ul>
            <li>AI Health Chat</li>
            <li>Lab Report Analysis</li>
            <li>Prescription Analysis</li>
            <li>Health Dashboard</li>
            <li>Medical History</li>
        </ul>

        <p>
            If you're seeing this page, the backend has started successfully and all frontend features are available.
        </p>
    </div>
</body>
</html>
"""
    
# Register both clean, separate routers
app.include_router(reports_router)
app.include_router(prescriptions_router)
app.include_router(chat_router)
