from pydantic import BaseModel
from typing import List, Optional, Dict

class UserBase(BaseModel):
    id: Optional[int] = None
    login: Optional[str] = None
    usos_access_token: Optional[Dict[str, str]] = None
    is_active: Optional[bool] = True
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    usos_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    password: str
    issues: List[int] = []
    comments: List[int] = []
    user_groups: List[int] = []

    class Config:
        orm_mode = True

class User(UserInDB):
    pass

class UserInGroupBase(BaseModel):
    score: Optional[int] = None
    is_active: Optional[bool] = True
    user_id: int
    group_id: int

class UserInGroupCreate(UserInGroupBase):
    pass

class UserInGroupInDB(UserInGroupBase):
    id: int

    class Config:
        orm_mode = True

class UserInGroup(UserInGroupInDB):
    pass

class GroupBase(BaseModel):
    code: str
    status: str

class GroupCreate(GroupBase):
    pass

class GroupInDB(GroupBase):
    id: int
    users: List[int] = []
    teams: List[int] = []

    class Config:
        orm_mode = True

class Group(GroupInDB):
    pass
