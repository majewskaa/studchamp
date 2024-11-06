from fastapi import HTTPException, Depends, status, FastAPI, Path
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.database import SessionLocal, engine
import database.models as models
import database.schemas as schemas
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi.responses import RedirectResponse
from objects.auth_class import auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import oauth2 as oauth
import sys
from datetime import datetime
from urllib.parse import parse_qsl
import json
from typing import Optional, Dict
from database.crud import *
from database.crud import get_user
from fastapi import Form
from fastapi.responses import HTMLResponse

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://172.27.21.177:3000",
    "http://127.0.0.1:8000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
usosapi_base_url = 'https://apps.usos.pw.edu.pl/'

consumer_key = 'kMh5GTUYZ2jqvYFH9zXL'
consumer_secret = 'zFvZvE7xh3DMDGJ7NZggeUSvvaa7N8PFKFJK3uNe'

usosapi_base_url_secure = usosapi_base_url.replace("http://", "https://")
request_token_url = usosapi_base_url_secure + 'services/oauth/request_token?scopes=studies|offline_access'
authorize_url = usosapi_base_url + 'services/oauth/authorize'
access_token_url = usosapi_base_url_secure + 'services/oauth/access_token'

consumer = oauth.Consumer(consumer_key, consumer_secret)

def _read_token(content):
    arr = {k.decode(): v.decode() for k, v in parse_qsl(content)}
    print(f"Parsed content: {arr}")
    return oauth.Token(arr['oauth_token'], arr['oauth_token_secret'])

class GroupBase(BaseModel):
    code: str
    status: bool

class GroupModel(GroupBase):
    id: int

    class Config:
        orm_mode = True

class IssueBase(BaseModel):
    title: str
    description: str
    points: int

class IssueModel(BaseModel):
    id: int

    class Config:
        orm_mode = True

class LoginData(BaseModel):
    login: str
    password: str

class RegisterUserData(BaseModel):
    password: str
    login: str

class RegisterTeamData(BaseModel):
    name: str
    group_code: str
    users: list

class RegisterTaskData(BaseModel):
    title: str
    description: str
    points: int
    author_id: int
    team_id: int
    subject_code: str
    project_id: int

class RegisterProjectData(BaseModel):
    name: str
    description: str
    subject_code: str
    team_id: int

class GetSubjectsData(BaseModel):
    user_id: int

class OauthData(BaseModel):
    oauth_token: str
    oauth_verifier: str
    user_id: int

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/groups/", response_model=GroupModel)
async def create_group(group: GroupBase, db: db_dependency):
    db_group = models.Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.get("/groups", response_model=List[GroupModel])
async def read_groups(db: db_dependency, skip: int = 0, limit: int = 100):
    groups = db.query(models.Group).offset(skip).limit(limit).all()
    print(groups)
    return groups

@app.delete("/groups/{group_id}", status_code=204)
async def delete_group(group_id: int, db: db_dependency):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    db.delete(group)
    db.commit()
    return

@app.get("/oauth/usos")
def redirect_to_usos(db: Session = Depends(get_db)):
    # Step 1. Request Token
    client = oauth.Client(consumer)
    request_token_url = f"{usosapi_base_url_secure}services/oauth/request_token?scopes=studies|offline_access&oauth_callback=oob"
    resp, content = client.request(request_token_url, "GET")
    if resp['status'] != '200':
        raise Exception("Invalid response %s:\n%s" % (resp['status'], content))

    request_token = dict(parse_qsl(content.decode("utf-8")))
    print("Request token: ", request_token)

    # Step 2. Obtain authorization on FE

    authorize_url_with_token = f"{authorize_url}?oauth_token={request_token['oauth_token']}"
    return {"success" : True, "url": authorize_url_with_token, "oauth_token": request_token['oauth_token'], "oauth_token_secret": request_token['oauth_token_secret']}

    # print ("Go to the following link in your browser:")
    # print ("%s?oauth_token=%s" % (authorize_url, request_token.key))
    # print('\n')
    # oauth_verifier = input('What is the PIN code? ')

    # usos_auth_url = usosapi_base_url + "services/oauth/request_token?oauth_callback=http://localhost:8000/oauth/usos-callback"
    # https://apps.usos.pw.edu.pl/services/oauth/authorize?oauth_token=3sqgaFy9bxEY8MUFPaXM
    # return RedirectResponse(url=usos_auth_url)

@app.post("/oauth/usos/pin")
def oauth_usos_pin(user_id: int = Form(...), pin: str = Form(...), oauth_token: str = Form(...), oauth_token_secret: str = Form(...), db: Session = Depends(get_db)):
    print(user_id, pin, oauth_token, oauth_token_secret)
    request_token = oauth.Token(oauth_token, oauth_token_secret)
    request_token.set_verifier(pin)
    print("request_token", request_token)
    client = oauth.Client(consumer, request_token)
    resp, content = client.request(access_token_url, "GET")
    print("content", content)
    access_token = dict(parse_qsl(content.decode("utf-8")))
    print("Access token: ", access_token)

    if "oauth_token" not in access_token:
        raise HTTPException(status_code=400, detail="Failed to obtain access token")

    # Store the access token in the database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.usos_access_token = {"key": access_token["oauth_token"], "secret": access_token["oauth_token_secret"]}
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="User not found")

    return {"success": True, "message": "Access Token stored successfully"}

@app.post("/logout")
def logout():
    auth.jwt_token = None
    return {"message": "Logged out"}

@app.get("/is_authenticated")
def is_authenticated(token: str = Depends(oauth2_scheme)):
    print(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return {"success": True, "is_authenticated": False}
        return {"success": True, "is_authenticated": True, "user_id": user_id}
    except JWTError:
        return {"success": True, "is_authenticated": False}

@app.post("/is_usos_authenticated")
def is_usos_authenticated(user_id: str = Form(...), user_token: str =Form(...), db: Session = Depends(get_db)):
    print('checking if user is usos authenticated')
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if verify_access_token(user_token) is None:
        return {"success": False, "message": "Invalid token"}
    if user:
        if user.usos_access_token is not None:
            return {"success": True, "message": "User is usos authenticated"}
    return {"success": False, "message": "User not authenticated"}

@app.post("/register")
def register(form_data: RegisterUserData):
    response = create_user(form_data)
    return response

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(login=login)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user(login=form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        return {"success":False, "message": "Invalid credentials"}
    access_token = create_access_token(data={"sub": user.login})
    return {"success":True, "access_token": access_token, "user_id": user.id, "token_type": "bearer", "message": "Successfull login"}

@app.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/")
def hello():
    print("Hello")

def request_new_token():
    # Step 1. Request Token
    client = oauth.Client(consumer)
    request_token_url = f"{usosapi_base_url_secure}services/oauth/request_token?scopes=studies|offline_access&oauth_callback=oob"
    resp, content = client.request(request_token_url, "GET")
    if resp['status'] != '200':
        raise Exception("Invalid response %s:\n%s" % (resp['status'], content))

    request_token = _read_token(content)
    # Step 2. Obtain authorization
    print ("Go to the following link in your browser:")
    print ("%s?oauth_token=%s" % (authorize_url, request_token.key))
    print('\n')
    oauth_verifier = input('What is the PIN code? ')
    # Step 3. Access Token
    request_token.set_verifier(oauth_verifier)
    client = oauth.Client(consumer, request_token)
    resp, content = client.request(access_token_url, "GET")
    try:
        access_token = _read_token(content)
    except KeyError:
        print( "Cound not retrieve Access Token (invalid PIN?).")
        sys.exit(1)
    return(access_token.key, access_token.secret)

def filter_active_courses(data):
    current_term = data['terms'][-1]['id']
    courses = data['groups'][current_term]
    ids = []

    for course in courses:
        id = course['course_id']
        if id not in ids:
            ids.append(course['course_id'])

    return ids

@app.get("/subjects/{user_id}/{token}")
def get_subjects(user_id: int, token: str, db: Session = Depends(get_db)):
    # if not auth.jwt_token or token != auth.jwt_token:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Invalid authentication credentials",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_access_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
    if user.usos_access_token is None:
        return {"success": False, "message": "User not authenticated"}
    access_token_key = user.usos_access_token['key']
    access_token_secret = user.usos_access_token['secret']

    access_token = oauth.Token(access_token_key, access_token_secret)
    client = oauth.Client(consumer,  access_token)

    resp2, content2 = client.request(usosapi_base_url + "services/groups/user?fields=course_name|group_number|course_is_currently_conducted", "GET")
    if resp2['status'] == '401':
        (access_token_key, access_token_secret) = request_new_token()
        access_token = oauth.Token(access_token_key, access_token_secret)
        client = oauth.Client(consumer,  access_token)
        resp2, content2 = client.request(usosapi_base_url + "services/groups/user?fields=course_name|group_number|course_is_currently_conducted", "GET")
    items = json.loads(content2)
    # print(items)
    active_courses_ids = filter_active_courses(items)
    add_courses(active_courses_ids)
    print(active_courses_ids)
    return {"success": True, "message": "Success", "subjects" : active_courses_ids}

@app.get("/subject/{subject_code}/members")
def get_subject(subject_code: str = Path(..., description="Subject CODE")):
    response = fetch_subject_members(subject_code)
    return response

@app.post("/teams")
def register_team(form_data: RegisterTeamData):
    response = create_team(form_data)
    return response

@app.get("/teams/{subject_id}")
def get_teams(subject_id: str = Path(..., description="Subject ID")):
    response = fetch_teams(subject_id)
    return response

@app.get("/team/{team_id}")
def get_team(team_id: str = Path(..., description="Team ID")):
    response = fetch_team(team_id)
    return response

@app.post("/tasks")
def register_task(form_data: RegisterTaskData):
    response = create_task(form_data)
    return response

@app.get("/tasks/{subject_id}/{team_id}")
def get_teams(subject_id: str = Path(..., description="Subject ID"), team_id: str = Path(..., description="Team ID")):
    response = fetch_tasks(subject_id, team_id)
    return response

@app.post("/projects")
def register_project(form_data: RegisterProjectData):
    response = create_project(form_data)
    return response

@app.get("/projects/{subject_id}/{team_id}")
def get_projects(subject_id: str = Path(..., description="Subject ID"), team_id: str = Path(..., description="Team ID")):
    response = fetch_projects(subject_id, team_id)
    return response

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    response = fetch_project(project_id)
    return response

@app.patch("/projects/{project_id}/{git_project_id}")
def patch_project_with_git_id(project_id: int, git_project_id: int):
    print("dupe", project_id)
    response = put_git_id(project_id, git_project_id)
    return response

@app.get("/commits/{project_id}")
def get_commits(project_id: int):
    response = fetch_commits(project_id)
    return response