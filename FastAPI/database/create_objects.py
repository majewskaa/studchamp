from sqlalchemy.orm import Session
from database.models import User, Group, Team, Issue, Project, User_in_team, User_in_group

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

def add_user_to_group_in_database(db: Session, user_id: int, group_id: str):
    create_user_in_group_in_database(db, user_id, group_id)
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise Exception("User not found")
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if not db_group:
        raise Exception("Group not found")
    db_group.users.append(db_user)

def create_user_in_group_in_database(db: Session, user_id: int, group_id: str):
    # Fetch the User instance
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise Exception("User not found")

    # Fetch the Group instance
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if not db_group:
        raise Exception("Group not found")

    # Create UserInGroup instance
    db_user_in_group = User_in_group(user_id=db_user.id, group_id=db_group.id, is_active=True, score=0, user=db_user, group=db_group)
    db.add(db_user_in_group)
    db.commit()
    return db_user_in_group

def create_team_in_database(db: Session, name: str, group_code: str, users: list):
    db_group = db.query(Group).filter(Group.code == group_code).first()
    if not db_group:
        raise Exception("Group not found")

    db_users = db.query(User).filter(User.id.in_(users)).all()
    if len(db_users) != len(users):
        raise Exception("One or more users not found")

    teams = db.query(Team).filter(Team.group_id == db_group.id).all()
    if any([team.name == name for team in teams]):
        raise Exception("Team with this name already exists")

    db_team = Team(name=name, status='active', group_id=db_group.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    add_users_to_team_in_database(db, db_team, db_users)
    return db_team

def add_users_to_team_in_database(db: Session, db_team: int, db_users: list):
    users = []
    for user in db_users:
        user_in_team = User_in_team(user_id=user.id, team_id=db_team.id)
        db.add(user_in_team)
        db.commit()
        db.refresh(user_in_team)
        users.append(user_in_team)
    db_team.users.extend(users)
    db.commit()
    db.refresh(db_team)

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