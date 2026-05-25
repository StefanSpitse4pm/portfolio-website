from fastapi import APIRouter, Depends, UploadFile, HTTPException
from starlette.responses import Response
from sqlalchemy import Select, Insert, Delete

from auth.dependencies import authenticate
from blog.models import Articles
from database import fetch_one, fetch_all, execute, get_db_connection

from pathlib import Path
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = Path("uploads/articles")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/article", status_code=201)
async def create_article(article: UploadFile, user = Depends(authenticate), db = Depends(get_db_connection)):
    extension = os.path.splitext(str(article.filename))[1]
    if extension not in [".md"]:
        raise HTTPException(415)

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{extension}"

    with file_path.open("wb") as f:
        shutil.copyfileobj(article.file, f)
    
    await execute(Insert(Articles).values(), db, commit=True) 

    file = await fetch_one(Select(Files).where(Files.file_path == file_path), db)
    if category is not None:
        c = await does_category_exist(category, db) 
        await execute(Insert(FileCategories).values(category_id=c["id"], file_id=file["id"]), db, commit=True)

    return {"file_id": file["id"]}


@router.get("/articles")
async def get_articles(user = Depends(authenticate), db = Depends(get_db_connection)):
    pass

@router.get("/article/{slug}")
async def get_article(slug: str, user = Depends(authenticate), db = Depends(get_db_connection)):
    pass

@router.patch("/article/{id}")
async def update_article(id: int, user = Depends(authenticate), db = Depends(get_db_connection)):
    pass

@router.delete("/article/{id}")
async def delete_article(id: int, user = Depends(authenticate), db = Depends(get_db_connection)):
    pass

@router.post("/upload-img", status_code=201)
async def upload_image(image: UploadFile, user = Depends(authenticate), db = Depends(get_db_connection)):
    pass
