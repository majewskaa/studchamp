from database.models import User, Issue, Group, Team, User_in_group, Project
from database.database import SessionLocal
from database.create_objects import *

import bcrypt
import requests
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

url = 'https://gitlab-stud.elka.pw.edu.pl/api/v4/groups'

access_token = 'glpat-emNL5hzNDTsSiXqxHGGh'

request_data = {
    'parent_id': '51805',
    'name': 'test_group',
    'path': 'test_group1',
    'visibility_level': '10',
    'setup_for_company': 'false',
}

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# authorisation

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(login: str, password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.login == login).first()
    db.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        return {"user": user}

    return None

def get_user(login: str):
    db = SessionLocal()
    user = db.query(User).filter(User.login == login).first()
    db.close()
    return user

def create_user(user_data):
    try:
        db = SessionLocal()
        hashed_password = get_password_hash(user_data.password)
        create_user_in_database(db, login=user_data.login, password=hashed_password)
        print('dups')
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()

    return {"success": True, "message": "User created successfully"}

def create_team(team_data):
    try:
        db = SessionLocal()
        create_team_in_database(db, name=team_data.name, group_code=team_data.group_code, users=team_data.users)
        print("Team created successfully")
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "message": "Team created successfully"}

def add_courses(courses_codes):
    print("Adding courses: " + str(courses_codes))
    for code in courses_codes:
        try:
            db = SessionLocal()
            create_group_in_database(db, code=code)
            print("Course " + code + " added")
        except Exception as e:
            db.close()
            print(e)
            return {"success": False, "message": e}

    db.close()
    print("Courses added successfully")
    return {"success": True, "message": "Course added successfully"}

def fetch_teams(subject_code: str):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        teams = db.query(Team).filter(Team.group_id == group.id).all()
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
        print("Teams fetched successfully")
    return {"success": True, "teams": teams}



def fetch_tasks(subject_code: str, team_id: int):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        tasks = db.query(Issue).filter(Issue.group_id == group.id).filter(Issue.team_id == team_id).all()
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
        print("Tasks fetched successfully")
    return {"success": True, "tasks": tasks}

def create_task(task_data):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == task_data.subject_code).first()
        create_issue_in_database(db, title=task_data.title, description=task_data.description,
                                  points=task_data.points, author_id=task_data.author_id,
                                  group_id=group.id, team_id=task_data.team_id, project_id=task_data.project_id)
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
        print("Task created successfully")
    return {"success": True, "message": "Task created successfully"}

def create_project(project_data):
    try:
        db = SessionLocal()
        print(project_data.subject_code)
        group = db.query(Group).filter(Group.code == project_data.subject_code).first()
        print(group)
        project = create_project_in_database(db, name=project_data.name, description=project_data.description,
                                   group_id=group.id, team_id=project_data.team_id)
        print("Project created successfully: ", project)
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "message": "Project created successfully"}

def fetch_projects(subject_code: str, team_id: int):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        projects = db.query(Project).filter(Project.group_id == group.id).filter(Project.team_id == team_id).all()
        print("Projects fetched successfully: ", projects)
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "projects": projects}

def fetch_project(project_id: int):
    try:
        db = SessionLocal()
        project = db.query(Project).filter(Project.id == project_id).first()
        print("Project fetched successfully: ", project)
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "project": project}

def fetch_subject_members(subject_code: str):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        users_in_group = db.query(User_in_group).filter(User_in_group.group_id == group.id).all()
        users = []
        for user_in_group in users_in_group:
            user = db.query(User).filter(User.id == user_in_group.user_id).first()
            if(user):
                users.append(user)
        print("Users fetched successfully: ", users)
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "users": users}


def fetch_team(team_id: int):
    try:
        db = SessionLocal()
        team = db.query(Team).filter(Team.id == team_id).first()
        users_in_team = db.query(User_in_team).filter(User_in_team.team_id == team_id).all()
        print(team)
        members = []
        for user_in_team in users_in_team:
            user = db.query(User).filter(User.id == user_in_team.user_id).first()
            if(user):
                members.append(user)
        team.members = members
        print("Team fetched successfully", team)
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "team": team}


def put_git_id(project_id, git_project_id):
    try:
        db = SessionLocal()
        project = db.query(Project).filter(Project.id == project_id).first()
        project.git_repo_link = git_project_id
        db.commit()
        db.refresh(project)
        print("Project updated successfully")
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "message": "Project updated successfully"}

def fetch_commits(project_id):
    url = f'https://gitlab-stud.elka.pw.edu.pl/api/v4/projects/{project_id}/repository/commits'
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("Commits fetched successfully!")
    else:
        print("Failed to fetch commits:", response.text)

    resp = count_commits_by_user(response.json())
    print("dupa11")
    print(resp)
    return {"success": True, "commits": resp}

def count_commits_by_user(commits):
    commit_counts = {}
    for commit in commits:
        email = commit['author_email']
        if email in commit_counts:
            commit_counts[email] += 1
        else:
            commit_counts[email] = 1
    return commit_counts

def write_usos_token(token, user_id):
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        user.usos_token = token
        db.commit()
        db.refresh(user)
        print("Usos token updated successfully")
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
    return {"success": True, "message": "Usos token updated successfully"}