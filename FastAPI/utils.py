from database.models import User
from database.database import SessionLocal
from database.create_objects import create_user_in_database
import bcrypt

def authenticate_user(email: str, password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        return {"user": user}

    return None

def create_user(user_data):
    try:
        db = SessionLocal()
        hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        create_user_in_database(db, email=user_data.email, password=hashed_password)
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()

    return {"success": True, "message": "User created successfully"}