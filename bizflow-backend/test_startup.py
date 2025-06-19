#!/usr/bin/env python3
"""
Simple test script to check backend startup issues
"""

import sys
import traceback

def test_imports():
    """Test if all imports work"""
    print("Testing imports...")
    try:
        from fastapi import FastAPI
        print("✅ FastAPI import OK")
        
        from app.database import init_db, engine
        print("✅ Database import OK")
        
        from app.models.user import User
        print("✅ User model import OK")
        
        from app.utils import hash_password
        print("✅ Utils import OK")
        
        from app.routers.auth import router
        print("✅ Auth router import OK")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        traceback.print_exc()
        return False

def test_database():
    """Test database connection"""
    print("\nTesting database...")
    try:
        from app.database import init_db
        init_db()
        print("✅ Database initialization OK")
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        traceback.print_exc()
        return False

def test_simple_app():
    """Test creating a simple FastAPI app"""
    print("\nTesting simple FastAPI app...")
    try:
        from fastapi import FastAPI
        app = FastAPI()
        
        @app.get("/test")
        def test():
            return {"status": "ok"}
            
        print("✅ Simple FastAPI app creation OK")
        return True
    except Exception as e:
        print(f"❌ FastAPI app error: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=== Backend Startup Test ===")
    
    # Test individual components
    imports_ok = test_imports()
    db_ok = test_database() if imports_ok else False
    app_ok = test_simple_app()
    
    print("\n=== Summary ===")
    print(f"Imports: {'✅' if imports_ok else '❌'}")
    print(f"Database: {'✅' if db_ok else '❌'}")
    print(f"FastAPI: {'✅' if app_ok else '❌'}")
    
    if all([imports_ok, db_ok, app_ok]):
        print("\n🎉 All tests passed! Backend should start correctly.")
        print("\nTry running: uvicorn app.main:app --reload")
    else:
        print("\n⚠️  Issues found. Fix the errors above first.")
        
    sys.exit(0 if all([imports_ok, db_ok, app_ok]) else 1) 