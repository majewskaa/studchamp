from database.models import User, Issue, Group, Team, User_in_group, Project
from database.database import SessionLocal
from database.create_objects import *

import bcrypt
import requests
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from objects.mappers import map_to_return_users

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

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=45)
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

def get_user_by_group_code(group_code: str):
    db = SessionLocal()
    group = db.query(Group).filter(Group.code == group_code).first()
    user_ids = db.query(User_in_group).filter(User_in_group.group_id == group.id).all()
    users = db.query(User).filter(User.id.in_([user_id.user_id for user_id in user_ids])).all()
    db.close()
    return users

def create_user(user_data):
    try:
        db = SessionLocal()
        hashed_password = get_password_hash(user_data.password)
        create_user_in_database(db, login=user_data.login, password=hashed_password)
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
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
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    return {"success": True, "message": "Team created successfully"}

def add_courses(courses_codes, user_id):

    print("Adding courses: " + str(courses_codes))
    db = SessionLocal()
    groups = db.query(Group).all()
    for code in courses_codes:
        if any(group.code == code for group in groups):
            print("Course " + code + " already exists")
            continue
        try:
            group = create_group_in_database(db, code=code)
            add_user_to_group_in_database(db, user_id, group.id)
            print("Course " + code + " added")
        except Exception as e:
            print(e)

    db.close()
    print("Courses added successfully")
    return {"success": True, "message": "Course added successfully"}

def update_user_in_group_for_user(user_id):
    db = SessionLocal()
    groups = db.query(Group).all()
    users_in_groups = db.query(User_in_group).where(User_in_group.user_id == user_id).all()
    user_group_ids = {user_in_group.group_id for user_in_group in users_in_groups if user_in_group.user_id == user_id}

    for group in groups:
        if group.id in user_group_ids:
            print("User already in group " + group.code)
        else:
            try:
                create_user_in_group_in_database(db, user_id=user_id, group_id=group.id)
                print("User added to group " + group.code)
            except Exception as e:
                print(e)
    db.close()

def fetch_teams(subject_code: str):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        teams = db.query(Team).filter(Team.group_id == group.id).all()
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
        print("Teams fetched successfully")
    return {"success": True, "teams": teams}

def fetch_tasks(project_id: int):
    try:
        db = SessionLocal()
        tasks = db.query(Issue).filter(Issue.project_id == project_id).all()
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
        print("Tasks fetched successfully")
    return {"success": True, "tasks": tasks}

def fetch_project_page_data(project_id: int):
    url_response = fetch_url(project_id)
    if not url_response['success']:
        return url_response

    tasks_response = fetch_tasks(project_id)
    if not tasks_response['success']:
        return tasks_response

    return {"success": True, "url": url_response['url'], "tasks": tasks_response['tasks']}


def fetch_active_courses_codes(user_id):
    db = SessionLocal()
    user_in_groups = db.query(User_in_group).filter(User_in_group.user_id == user_id).all()
    groups = db.query(Group).all()
    active_courses_codes = [group.code for group in groups if any((user_in_group.group_id == group.id and group.status == 'active')  for user_in_group in user_in_groups)]
    db.close()
    print("Active courses codes fetched successfully")
    return active_courses_codes

def create_task(task_data):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == task_data.subject_code).first()
        create_issue_in_database(db, title=task_data.title, description=task_data.description,
                                  points=task_data.points, author_id=task_data.author_id,
                                  group_id=group.id, team_id=task_data.team_id, project_id=task_data.project_id)
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
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
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    return {"success": True, "message": "Project created successfully"}

def edit_project_in_db(project_data, project_id):
    try:
        db = SessionLocal()
        project = db.query(Project).filter(Project.id == project_id).first()
        project.name = project_data.name
        project.description = project_data.description
        project.git_repo_link = project_data.git_repo_id
        db.commit()
        db.refresh(project)
        print("Project updated successfully")
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    return {"success": True, "message": "Project updated successfully"}

def fetch_projects(subject_code: str, team_id: int):
    try:
        db = SessionLocal()
        group = db.query(Group).filter(Group.code == subject_code).first()
        projects = db.query(Project).filter(Project.group_id == group.id).filter(Project.team_id == team_id).all()
        print("Projects fetched successfully: ", projects)
    except Exception as e:
        db.close()
        print(e)
        return {"success": False, "message": e.__str__()}
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
        return {"success": False, "message": e.__str__()}
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
        return {"success": False, "message": e.__str__()}
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
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    return {"success": True, "team": team}

def fetch_team_members(team_id: int):
    try:
        db = SessionLocal()
        users_in_team = db.query(User_in_team).filter(User_in_team.team_id == team_id).all()
        users = []
        for user_in_team in users_in_team:
            user = db.query(User).filter(User.id == user_in_team.user_id).first()
            if(user):
                users.append(user)
        print("Users fetched successfully: ", users)
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    users = map_to_return_users(users)
    return {"success": True, "users": users}

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
        return {"success": False, "message": e.__str__()}
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
    print(resp)
    return {"success": True, "commits": resp}

def fetch_git_project_id(project_id):
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    db.close()
    return project.git_repo_link

def  fetch_url(project_id):
    git_project_id = fetch_git_project_id(project_id)
    url = f'https://gitlab-stud.elka.pw.edu.pl/api/v4/projects/{git_project_id}'
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("URL fetched successfully!")
        return {"success": True, "url": response.json()['web_url']}
    else:
        return {"success": False, "message": response.text}

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
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
    return {"success": True, "message": "Usos token updated successfully"}

def fetch_edit_team_modal_data(team_id):
    try:
        db = SessionLocal()
        team = db.query(Team).filter(Team.id == team_id).first()
        team_name = team.name
        user_in_team_team_members = db.query(User_in_team).filter(User_in_team.team_id == team_id).all()
        team_members = db.query(User).filter(User.id.in_([user_in_team.user_id for user_in_team in user_in_team_team_members])).all()
        group = db.query(Group).filter(Group.id == team.group_id).first()
        user_in_group_group_members = db.query(User_in_group).filter(User_in_group.group_id == group.id).all()
        group_members = db.query(User).filter(User.id.in_([user_in_group.user_id for user_in_group in user_in_group_group_members])).all()
        print("Data fetched successfully", team)
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
        team_members = map_to_return_users(team_members)
        group_members = map_to_return_users(group_members)
    return {"success": True, "team_name": team_name, "team_members": team_members, "group_members": group_members}

def update_team(team_data):
    users = []
    try:
        db = SessionLocal()
        team = db.query(Team).filter(Team.id == team_data.id).first()
        team.name = team_data.name
        users_in_team = db.query(User_in_team).filter(User_in_team.team_id == team.id).all()
        print(f'users_in_team: {users_in_team}')
        for user_in_team in users_in_team:
            if user_in_team.team_id == team.id and user_in_team.user_id not in team_data.members:
                db.delete(user_in_team)
        print(f'membes: {team_data.members}')
        for user_id in team_data.members:
            if not any(user_in_team.user_id == user_id for user_in_team in users_in_team):
                user = db.query(User).filter(User.id == user_id).first()
                print(f'adding {user.login}')
                add_users_to_team_in_database(db, team, [user])
        db.commit()
        users = db.query(User).filter(User.id.in_(team_data.members)).all()
        db.refresh(team)
        print("Team updated successfully")
    except Exception as e:
        db.close()
        return {"success": False, "message": e.__str__()}
    finally:
        db.close()
        users = map_to_return_users(users)
    return {"success": True, "team": {"id": team.id, "name": team.name, "members": users}}