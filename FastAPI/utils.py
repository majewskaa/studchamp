from database.models import User
from database.database import SessionLocal
from database.create_objects import *
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

def create_team(team_data):
    try:
        db = SessionLocal()
        create_team_in_database(db, name=team_data.name, group_code=team_data.group_code, users=team_data.users)
    except Exception as e:
        db.close()
        return {"success": False, "message": e}
    finally:
        db.close()
        print("Team created successfully")
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