from database import execute, fetch_one
from sqlalchemy import Select
from portfolio.models import Categories
from fastapi import HTTPException
from database import execute
from sqlalchemy import Insert


async def does_category_exist(category: str, db):
    exists = await fetch_one(Select(Categories).where(Categories.category_name == category), db)        
    if not exists:
        await execute(Insert(Categories).values(category_name=category), db, commit=True)
        exists = await fetch_one(Select(Categories).where(Categories.category_name == category), db)        
    return exists
