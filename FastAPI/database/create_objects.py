from sqlalchemy.orm import Session
from database.models import User

def create_user_in_database(db: Session, email: str, password: str):
    db_user = User(email=email, password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user