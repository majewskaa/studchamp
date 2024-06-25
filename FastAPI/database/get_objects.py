from sqlalchemy.orm import Session
from database.models import User

def get_subjects(db: Session, user_id: int):
    usos_access_token = db.query(User).filter(User.id == user_id).first().usos_access_token


def get_subject(db: Session, subject_id: int, user_id: int):
    usos_access_token = db.query(User).filter(User.id == user_id).first().usos_access_token
    pass