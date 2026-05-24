from fastapi import Depends, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordRequestForm 
from auth.schemas import User 
from auth.service import authenticate_user, create_access_token, get_password_hash
from database import get_db_connection, fetch_one, execute
from sqlalchemy import select, insert
from auth.models import UserModel


router = APIRouter()
@router.post("/token")
async def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db_connection)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me")
def get_current_users():
    pass

@router.post("/users/create_user")
async def create_user(user: User, db = Depends(get_db_connection)):
    existing = await fetch_one(select(UserModel).where(UserModel.username == user.username), db)
    if existing:
        raise HTTPException(status_code=409, detail="Already exists")
    hashed_password = get_password_hash(user.password)

    await execute(insert(UserModel).values(username=user.username, hashed_password=hashed_password), db, commit=True) 

    

