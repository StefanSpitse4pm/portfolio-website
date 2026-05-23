from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()
@router.get("/blog")
async def get_blog():
    pass

@router.post("/blog")
async def post_blog():
    pass

@router.delete("/blog")
async def delete_blog():
    pass

@router.put("/blog")
async def update_blog():
    pass




