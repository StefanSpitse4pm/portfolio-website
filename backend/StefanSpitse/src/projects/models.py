from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass
    
class Projects(Base):
    __tablename__ = "projects" 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    tags = relationship("Project_tags", back_populates="project_id", remote_side=[id])
    url = Column(String(255)) 
    date = Column(Date)
    article = Column(String(255), nullable=True) 

class ProjectTags(Base):
    __tablename__ = "project_tags" 
    id = Column(Integer, primary_key=True, index=True)
    tags = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    project_id = relationship("Projects", back_populates="tags", remote_side=[id])



