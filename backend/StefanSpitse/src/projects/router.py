from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()
@router.get("/projects")
async def get_projects():
    pass

@router.post("/projects")
async def post_projects():
    pass

@router.delete("/projects")
async def delete_projects():
    pass

@router.put("/projects")
async def update_projects():
    pass




