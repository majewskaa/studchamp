from database.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__='user'
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, nullable=True)
    password = Column(String, unique=True)
    usos_access_token = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    usos_id = Column(Integer, unique=True)
    issues = relationship("Issue", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    user_groups = relationship("User_in_group", back_populates="user")

class User_in_group(Base):
    __tablename__='user_in_group'
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer)
    is_active = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    group_id = Column(Integer, ForeignKey('group.id'))
    user = relationship("User", back_populates="user_groups")
    group = relationship("Group", back_populates="users")

class Group(Base):
    __tablename__='group'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    status = Column(String)
    users = relationship("User_in_group", back_populates="group")
    teams = relationship("Team", back_populates="group")
    issues = relationship("Issue", back_populates="group")
    projects = relationship("Project", back_populates="group")

class Team(Base):
    __tablename__='team'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
    users = relationship("User_in_team", back_populates="team")
    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship("Group", back_populates="teams")
    issues = relationship("Issue", back_populates="team")
    projects = relationship("Project", back_populates="team")

class User_in_team(Base):
    __tablename__='user_in_team'
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    is_active = Column(Boolean, default=True)
    team = relationship("Team", back_populates="users")
    user = relationship("User", backref="user_in_teams")
    commits = Column(Integer, default=0)

class Issue(Base):
    __tablename__ = 'issue'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    points = Column(Integer)
    status = Column(String)
    author_id = Column(Integer, ForeignKey('user.id'))
    group_id = Column(Integer, ForeignKey('group.id'))
    team_id = Column(Integer, ForeignKey('team.id'))
    project_id = Column(Integer, ForeignKey('project.id'))
    project = relationship("Project", back_populates="issues")
    group = relationship("Group", back_populates="issues")
    team = relationship("Team", back_populates="issues")
    author = relationship("User", back_populates="issues")
    comments = relationship("Comment", back_populates="issue")

class Project(Base):
    __tablename__ = 'project'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    status = Column(String)
    issues = relationship("Issue", back_populates="project")
    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship("Group", back_populates="projects")
    team_id = Column(Integer, ForeignKey('team.id'))
    team = relationship("Team", back_populates="projects")
    git_repo_link = Column(String, default="")

class Comment(Base):
    __tablename__ = 'comment'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    status = Column(Boolean)
    author_id = Column(Integer, ForeignKey('user.id'))
    issue_id = Column(Integer, ForeignKey('issue.id'))
    issue = relationship("Issue", back_populates="comments")
    author = relationship("User", back_populates="comments")