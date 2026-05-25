from fastapi import APIRouter, Depends
from starlette.responses import Response
from projects.schemas import Project
from projects.models import Projects, ProjectTags
from database import fetch_all, fetch_one, execute, get_db_connection
from auth.dependencies import authenticate

from sqlalchemy import Select, Delete, Insert

router = APIRouter()

@router.post("/project", status_code=201)
async def create_project(project: Project, user = Depends(authenticate), db = Depends(get_db_connection)):
    query = Insert(Projects).values(
                                    name=project.name,
                                    description=project.description,
                                    url=project.gh,
                                    date=project.date,
                                    article=project.article
                                )
    await execute(query,db,commit=True)
    created = await fetch_one(Select(Projects).where(Projects.name == project.name), db)

    for tag in project.technologies:
        await execute(Insert(ProjectTags).values(tag=tag, project_id=created["id"]), db, commit=True)

    return project

@router.get("/projects")
async def get_all_projects():
    return await fetch_all(Select(Projects)) 

@router.get("/projects/{project_id}")
async def get_project(project_id: int):
    project = await fetch_one(Select(Projects).where(Projects.id == project_id))
    return project

@router.delete("/project/{project_id}")
def delete_project(project_id: int):
    pass

@router.put("/project/{project_id}")
def update_project(project_id: int):
    pass

