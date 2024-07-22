from sqlalchemy.orm import Session
from database.models import User, Group, Team, Issue, Project

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
    db_group = db.query(Group).filter(Group.code == group_code).first()
    if not db_group:
        raise Exception("Group not found")
    db_team = Team(name=name, status='active', group_id=db_group.id, users=users)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def create_issue_in_database(db: Session, title: str, description: str, points: int, author_id: int, group_id: int, team_id: int, project_id: int):
    db_issue = Issue(title=title, description=description,
                      points=points, status="created", author_id=author_id,
                      group_id=group_id, team_id=team_id, project_id=project_id)
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    print("Issue created")
    return db_issue

def create_project_in_database(db: Session, name: str, description: str, group_id: int, team_id: int):
    db_project = Project(name=name, description=description, status="created", group_id=group_id, team_id=team_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    print("Project created")
    return db_project