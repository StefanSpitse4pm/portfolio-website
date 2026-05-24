from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm 
from auth.schemas import User 


router = APIRouter()
@router.post("/token")
def get_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    pass

@router.get("/users/me")
def get_current_users():
    pass

@router.post("/users/create_user")
def create_user(user: User):
    pass

