from fastapi import APIRouter, Depends, UploadFile, HTTPException 
from fastapi.responses import FileResponse
from starlette.responses import Response
from sqlalchemy import Select, Insert, Delete, Update

from auth.dependencies import authenticate
from blog.dependecies import parse_article
from blog.models import Articles
from blog.schemas import Article
from database import fetch_one, fetch_all, execute, get_db_connection

from pathlib import Path
import os
import uuid
import shutil
import json

router = APIRouter()

UPLOAD_DIR = Path("uploads/articles")
IMAGE_DIR = Path("uploads/images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/article", status_code=201)
async def create_article(file: UploadFile, article: Article = Depends(parse_article), user = Depends(authenticate), db = Depends(get_db_connection)):
    extension = os.path.splitext(str(file.filename))[1]
    if extension not in [".md"]:
        raise HTTPException(415)

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{extension}"

    with file_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    query = Insert(Articles).values(title=article.title,
                                    slug=article.slug_,
                                    file_path=file_path,
                                    file_name=file.filename,
                                    cover_image=article.cover_image,
                                    status=article.status,
                                    created_at=article.created_at,
                                    published_at=article.published_at 
                                ) 
    await execute(query, db, commit=True) 

    article_file = await fetch_one(Select(Articles).where(Articles.file_path == file_path), db)
    return {"file_id": article_file["id"]}


@router.get("/articles")
async def get_articles(user = Depends(authenticate), db = Depends(get_db_connection)):
    return await fetch_all(Select(Articles), db)

@router.get("/article/{slug}")
async def get_article(slug: str, user = Depends(authenticate), db = Depends(get_db_connection)):
    file = await fetch_one(Select(Articles).where(Articles.slug == slug), db)

    if not file:
        raise HTTPException(400, detail=f"id:{slug} does not exist")
    return FileResponse(file["file_path"], media_type="text/markdown", filename=file["file_name"])

@router.patch("/article/{slug}")
async def update_article(slug: str, file: UploadFile | None = None, article: Article | None = Depends(parse_article), user = Depends(authenticate), db = Depends(get_db_connection)):
    exists = await fetch_one(Select(Articles).where(Articles.slug == slug), db)
    if file is not None:
        extension = os.path.splitext(str(file.filename))[1]
        if extension not in [".md"]:
            raise HTTPException(415)

        file_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{file_id}{extension}"

        with file_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        await execute(Update(Articles).values(file_path=file_path,file_name=file.filename), db, commit=True)

    if not exists:
        raise HTTPException(400, detail=f"id:{slug} does not exist")
    if article is not None:
        await execute(Update(Articles).values(
                                        title=article.title,
                                        slug=article.slug_,
                                        cover_image=article.cover_image,
                                        status=article.status,
                                        created_at=article.created_at,
                                        published_at=article.published_at 
                                    ), db, commit=True)
    

@router.delete("/article/{slug}")
async def delete_article(slug: str, user = Depends(authenticate), db = Depends(get_db_connection)):
    exists = await fetch_all(Select(Articles).where(Articles.slug == slug), db)
    if not exists:
        raise HTTPException(400, detail=f"slug:{slug} does not exist")

    await execute(Delete(Articles).where(Articles.slug == slug), db, commit=True)
    

@router.post("/upload-img", status_code=201)
async def upload_image(image: UploadFile, user = Depends(authenticate)):
    extension = os.path.splitext(str(image.filename))[1]
    if extension not in [".png", ".jpg", ".jpeg", ".gif"]:
        raise HTTPException(415)

    file_id = str(uuid.uuid4())
    file_path = IMAGE_DIR / f"{file_id}{extension}"

    with file_path.open("wb") as f:
        shutil.copyfileobj(image.file, f)
    return {"file_path": file_path}

