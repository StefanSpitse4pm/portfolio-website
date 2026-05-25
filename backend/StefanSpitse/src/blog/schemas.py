from pydantic import BaseModel, Field 
from datetime import datetime

class Article(BaseModel):
    title: str
    slug: str =  Field(..., pattern=r'^\S+$') # No spaces
    cover_image: str
    status: str
    created_at: datetime = datetime.now()
    published_at: datetime = datetime.now()
