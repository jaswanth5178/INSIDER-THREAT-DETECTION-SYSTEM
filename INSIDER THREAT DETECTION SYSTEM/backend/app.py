from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔹 Import routers
from api.auth_routes import router as auth_router
from api.protected_routes import router as protected_router
from api.anomaly_routes import router as anomaly_router
from api.assign_routes import router as assign_router   # ✅ NEW
from api.blocked_routes import router as blocked_router
app = FastAPI(title="Insider Threat System")

# ✅ CORS (Frontend React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 In production restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Root route
@app.get("/")
def root():
    return {"message": "Insider Threat System API is running 🚀"}

# 🔹 Authentication Routes
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

# 🔹 Protected Dashboard Routes
app.include_router(
    protected_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

# 🔹 Anomaly Data Routes (Frontend Dashboard uses this)
app.include_router(
    anomaly_router,
    prefix="/api",
    tags=["Anomalies"]
)

# 🔥 NEW: Assign to Analyst (EMAIL FEATURE)
app.include_router(
    assign_router,
    prefix="/api",
    tags=["Assign"]
)
app.include_router(
    blocked_router,
    prefix="/api",
    tags=["Blocked"]
)