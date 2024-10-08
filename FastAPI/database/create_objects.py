from sqlalchemy.orm import Session
from database.models import User, Group, Team, Issue, Project, User_in_team

def create_user_in_database(db: Session, login: str, password: str):
    db_user = User(login=login, password=password)
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
    # Fetch the Group instance
    db_group = db.query(Group).filter(Group.code == group_code).first()
    if not db_group:
        raise Exception("Group not found")

    # Fetch User instances based on user_ids
    db_users = db.query(User).filter(User.id.in_(users)).all()
    if len(db_users) != len(users):
        raise Exception("One or more users not found")

    # Create Team instance
    db_team = Team(name=name, status='active', group_id=db_group.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    # Assuming UserInTeam is the association model between User and Team
    for user in db_users:
        user_in_team = User_in_team(user_id=user.id, team_id=db_team.id)
        db.add(user_in_team)

    db.commit()
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