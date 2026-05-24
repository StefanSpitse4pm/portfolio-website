from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, relationship, Mapped

class Base(DeclarativeBase):
    pass

class Files(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, unique=True, index=True)
    file_name = Column(String)

    file_x_categories = relationship("File", back_populates="files_categories")

class Categories(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    parent = relationship("Category", back_populates="children", remote_side=[id])
    children = relationship("Category", back_populates="parent")
    file_x_categories = relationship("FileCategories", back_populates="file_categories")

class FileCategories(Base):
    __tablename__ = "file_categories"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="file_categories")

    file_id = Column(Integer, ForeignKey("files.id"))
    category = relationship("File", back_populates="files")

