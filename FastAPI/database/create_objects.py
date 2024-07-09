from sqlalchemy.orm import Session
from database.models import User, Group, Team

def create_user_in_database(db: Session, email: str, password: str):
    db_user = User(email=email, password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_group_in_database(db: Session, code: str):
    db_group = Group(code=code, status='active')
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

def create_team_in_database(db: Session, name: str, group_code: str, users: list):
    print("dupa2")
    db_group = db.query(Group).filter(Group.code == group_code).first()
    if not db_group:
        raise Exception("Group not found")
    db_team = Team(name=name, status='active', group_id=db_group.id, users=users)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team