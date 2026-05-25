from fastapi import APIRouter
from starlette.responses import Response
from projects.schemas import Project
from projects.models import ProjectModel, ProjectTags
from database import fetch_one, execute

from sqlalchemy import Select, Delete, Insert

router = APIRouter()

@router.post("/project", status_code=201)
async def create_project(project: Project):
    query = Insert(ProjectModel).values(
                                    name=project.name,
                                    description=project.description,
                                    url=project.gh,
                                    date=project.date,
                                    article=project.article
                                )
    await execute(query, commit=True)
    return project
     

@router.get("/projects/{project_id}")
def get_project(project_id: int):
    pass

@router.delete("/project/{project_id}")
def delete_project(project_id: int):
    pass

@router.put("/project/{project_id}")
def update_project(project_id: int):
    pass

