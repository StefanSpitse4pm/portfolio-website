from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class TokenData(BaseModel):
    username: str | None = None

