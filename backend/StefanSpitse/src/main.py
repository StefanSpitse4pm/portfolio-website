from auth.router import router as auth_route
from fastapi import FastAPI

# project: StefanSpitse

app = FastAPI()

app.include_router(auth_route)
