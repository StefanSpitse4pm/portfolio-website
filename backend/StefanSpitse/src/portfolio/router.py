from fastapi import APIRouter, Depends, UploadFile 
from starlette.responses import Response

from auth.dependencies import authenticate
from auth.schemas import TokenData

router = APIRouter()

@router.post("/portfolio/upload-pdf/")
async def upload_pdf(uploaded_file: UploadFile,user: TokenData = Depends(authenticate)):
    print(uploaded_file.file.name)



