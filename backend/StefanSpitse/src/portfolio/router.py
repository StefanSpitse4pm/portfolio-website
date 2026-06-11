from fastapi import APIRouter, Depends, HTTPException,UploadFile 
import os
import uuid
import shutil
from pathlib import Path

from fastapi.responses import FileResponse
from database import fetch_all, fetch_one, get_db_connection, execute
from portfolio.service import does_category_exist

from auth.dependencies import authenticate
from auth.schemas import TokenData
from portfolio.models import Files, Categories, FileCategories

from sqlalchemy import Insert, Select, Delete

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/portfolio/upload-pdf/")
async def upload_pdf(pdf: UploadFile, display_name:str | None = None, category:str | None = None, user: TokenData = Depends(authenticate), db = Depends(get_db_connection)):
    extension = os.path.splitext(str(pdf.filename))[1]
    if extension not in [".pdf", ".docx"]:
        raise HTTPException(415)

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{extension}"

    with file_path.open("wb") as f:
        shutil.copyfileobj(pdf.file, f)
    
    await execute(Insert(Files).values(file_path=file_path,display_name=display_name, file_name=pdf.filename), db, commit=True) 

    file = await fetch_one(Select(Files).where(Files.file_path == file_path), db)
    if category is not None:
        c = await does_category_exist(category, db) 
        await execute(Insert(FileCategories).values(category_id=c["id"], file_id=file["id"]), db, commit=True)

    return {"file_id": file["id"]}

@router.get("/portfolio/files")
async def get_all_files(user: TokenData = Depends(authenticate), db = Depends(get_db_connection)):
    return await fetch_all(Select(Files, FileCategories, Categories).join(Files, Files.id == FileCategories.file_id), db)

@router.get("/portfolio/file/{file_id}")
async def get_file(file_id: int, user: TokenData = Depends(authenticate), db = Depends(get_db_connection)):
    file = await fetch_one(Select(Files, FileCategories.category).where(Files.id == file_id), db)
    return FileResponse(file["file_path"], media_type="application/pdf", filename=file["file_name"])


@router.delete("/portfolio/file/{file_id}")
async def delete_file(file_id: int, user: TokenData = Depends(authenticate), db = Depends(get_db_connection)):
    await execute(Delete(Files).where(Files.id == file_id), db, commit=True)

