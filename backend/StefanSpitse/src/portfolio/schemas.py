from pydantic import BaseModel

class File(BaseModel):
    file_path: str
    categories: list[str]

