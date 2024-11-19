from typing import List
from database.schemas import UserBase
from database.models import User

def map_to_return_users(users: List[User]) -> List[UserBase]:
    base_users = []
    for user in users:
        new_user = UserBase(id=user.id, login=user.login, usos_access_token=user.usos_access_token, is_active=user.is_active, first_name=user.first_name, last_name=user.last_name, usos_id=user.usos_id)
        base_users.append(new_user)
    return base_users