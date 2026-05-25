from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date

class Project(BaseModel):
    name: str
    description: str
    technologies: list[str]
    gh: HttpUrl
    date: date
    article: Optional[HttpUrl] = None
    

