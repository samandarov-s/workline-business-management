"""
Minimal FastAPI backend for testing connectivity
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Minimal Workline API")

# Configure CORS - allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple endpoints
@app.get("/")
def root():
    return {"message": "Minimal Workline backend is running"}

@app.get("/test-cors")
def test_cors():
    return {"status": "success", "message": "CORS is working correctly"}

@app.post("/auth/login")
def fake_login(username: str = "", password: str = ""):
    """Fake login endpoint for testing"""
    if username == "admin@test.com" and password == "admin123":
        return {
            "access_token": "fake-jwt-token-for-testing",
            "token_type": "bearer",
            "expires_in": 3600
        }
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")

# Health check
@app.get("/health")
def health():
    return {"status": "healthy", "backend": "minimal"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 