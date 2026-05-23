from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()
@router.get("/auth")
async def get_auth():
    pass

@router.post("/auth")
async def post_auth():
    pass




