from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Files(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(512), unique=True, index=True)
    display_name = Column(String(512))
    file_name = Column(String(512))
    file_categories = relationship("FileCategories", back_populates="file")

class Categories(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(255))
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    parent = relationship("Categories", back_populates="children", remote_side=[id])
    children = relationship("Categories", back_populates="parent")
    file_categories = relationship("FileCategories", back_populates="category")

class FileCategories(Base):
    __tablename__ = "file_categories"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    file_id = Column(Integer, ForeignKey("files.id"))
    category = relationship("Categories", back_populates="file_categories")
    file = relationship("Files", back_populates="file_categories")
