from fastapi import APIRouter
from starlette.responses import Response
from projects.schemas import Project

router = APIRouter()

@router.post("/project")
def create_project(project: Project):
    pass

@router.get("/projects/{project_id}")
def get_project(project_id: int):
    pass

@router.delete("/project/{project_id}")
def delete_project(project_id: int):
    pass

@router.put("/project/{project_id}")
def update_project(project_id: int):
    pass

