from portfolio.router import router as portfolio_route
from blog.router import router as blog_route
from projects.router import router as projects_route
from auth.router import router as auth_route
from fastapi import FastAPI

# project: StefanSpitse

app = FastAPI()

app.include_router(auth_route)
app.include_router(projects_route)
app.include_router(blog_route)
app.include_router(portfolio_route)
