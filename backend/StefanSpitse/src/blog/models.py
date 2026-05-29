from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import Base

from datetime import datetime


class Articles(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String, unique=True)
    file_name = Column(String)
    file_path = Column(String, unique=True, index=True)
    cover_image = Column(String)
    status = Column(String, default="draft")
    created_at   = Column(DateTime, default=datetime.now)
    published_at = Column(DateTime, nullable=True)
