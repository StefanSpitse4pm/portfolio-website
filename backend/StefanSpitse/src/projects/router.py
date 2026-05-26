from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import Response
from projects.schemas import Project
from projects.models import Projects, ProjectTags
from database import fetch_all, fetch_one, execute, get_db_connection
from auth.dependencies import authenticate

from sqlalchemy import Select, Delete, Insert, Update

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
async def get_all_projects(user = Depends(authenticate), db = Depends(get_db_connection)):
    return await fetch_all(Select(Projects), db) 

@router.get("/projects/{project_id}")
async def get_project(project_id: int, user = Depends(authenticate), db = Depends(get_db_connection)):
    projects = await fetch_all(Select(Projects, ProjectTags.tag).where(Projects.id == project_id).join(ProjectTags, Projects.id == ProjectTags.project_id), db)
    if not projects:
        raise HTTPException(400, detail=f"id:{project_id} does not exist")
    project = projects[0]
    tags = [p["tag"] for p in projects]
    project["tag"] = tags

    return project
    

@router.delete("/project/{project_id}")
async def delete_project(project_id: int, user = Depends(authenticate), db = Depends(get_db_connection)):
    await execute(Delete(Projects).where(Projects.id == project_id), db, commit=True)


@router.put("/project/{project_id}")
async def update_project(project_id: int, project: Project, user = Depends(authenticate), db = Depends(get_db_connection) ):
    query = Update(Projects).values(name=project.name,description=project.description,url=project.gh, date=project.date,article=project.article)
    await execute(query, db, commit=True)

    for tag in project.technologies:
        await execute(Delete(ProjectTags).where(ProjectTags.project_id == project_id), db, commit=True)
        await execute(Insert(ProjectTags).values(tag=tag, project_id=project_id), db, commit=True)


