from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()
@router.get("/portfolio")
async def get_portfolio():
    pass

@router.post("/portfolio")
async def post_portfolio():
    pass

@router.delete("/portfolio")
async def delete_portfolio():
    pass

@router.put("/portfolio")
async def update_portfolio():
    pass




