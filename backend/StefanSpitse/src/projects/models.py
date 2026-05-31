from sqlalchemy import Column, ForeignKey, Integer, String, Date
from sqlalchemy.orm import relationship

from database import Base
    
class Projects(Base):
    __tablename__ = "projects" 
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(255))
    tags = relationship("ProjectTags", back_populates="project_id_r")
    url = Column(String(255)) 
    date = Column(Date)
    article = Column(String(255), nullable=True) 

class ProjectTags(Base):
    __tablename__ = "project_tags" 
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(30))
    project_id = Column(Integer, ForeignKey("projects.id"))
    project_id_r = relationship("Projects", back_populates="tags")

