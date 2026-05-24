from fastapi import APIRouter, Depends, HTTPException,UploadFile 
import os
import uuid
import shutil
from pathlib import Path
from database import fetch_one, get_db_connection, execute

from auth.dependencies import authenticate
from auth.schemas import TokenData
from portfolio.schemas import File
from portfolio.models import Files, Categories, FileCategories

from sqlalchemy import Insert

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/portfolio/upload-pdf/")
async def upload_pdf(pdf: UploadFile, categories: list[str], user: TokenData = Depends(authenticate), db = Depends(get_db_connection)):
    extension = os.path.splitext(str(pdf.filename))[1]
    if extension not in [".pdf", ".docx"]:
        raise HTTPException(415)
    
    for category in categories:
       fetch_one(Select()) 

    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}{extension}"

    with file_path.open("wb") as f:
        shutil.copyfileobj(pdf.file, f)
    
    await execute(Insert(Files).values(file_path=file_path, file_name=pdf.filename), db, commit=True) 
