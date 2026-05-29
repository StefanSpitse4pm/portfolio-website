from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import Base

from datetime import datetime


class Articles(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    slug = Column(String(255), unique=True)
    file_name = Column(String(512))
    file_path = Column(String(512), unique=True, index=True)
    cover_image = Column(String(512))
    status = Column(String(20), default="draft")
    created_at   = Column(DateTime, default=datetime.now)
    published_at = Column(DateTime, nullable=True)
