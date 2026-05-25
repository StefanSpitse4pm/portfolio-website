from database import fetch_one
from sqlalchemy import Select
from portfolio.models import Categories
from fastapi import HTTPException


async def does_category_exist(category: str, db):
    exists = await fetch_one(Select(Categories).where(Categories.category_name == category), db)        
    if not exists:
        raise HTTPException(400, detail=f"{category} doesn't exist")
    return exists
