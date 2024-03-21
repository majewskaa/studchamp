from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

class User(Base):
    __tablename__='user'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    last_name = Column(String)

class User_in_group(Base):
    __tablename__='user_in_group'

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer)

class Group(Base):
    __tablename__='group'

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    status = Column(Boolean)

class Lecturer(Base):
    __tablename__='Lecturer'

    id = Column(Integer, primary_key=True, index=True)


class Student(Base):
    __tablename__ = 'Student'

    id = Column(Integer, primary_key=True, index=True)

class Issue(Base):
    __tablename__ = 'Issue'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    points = Column(Integer)

class Comment(Base):
    __tablename__ = 'Comment'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)