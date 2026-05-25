from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship

from datetime import datetime

class Base(DeclarativeBase):
    pass

class Articles(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String)
    file_path = Column(String, unique=True, index=True)
    cover_image = Column(String)
    status = Column(String, default="draft")
    created_at   = Column(DateTime, default=datetime.now)
    published_at = Column(DateTime, nullable=True)
