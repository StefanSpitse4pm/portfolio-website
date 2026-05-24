from fastapi import APIRouter, Depends, HTTPException,UploadFile 
import os

from auth.dependencies import authenticate
from auth.schemas import TokenData
from portfolio.schemas import File

router = APIRouter()

@router.post("/portfolio/upload-pdf/")
async def upload_pdf(pdf: UploadFile,categories: list[str], user: TokenData = Depends(authenticate)):
    if os.path.splitext(str(pdf.filename))[1] not in [".pdf", ".docx"]:
        raise HTTPException(415)

     

        




