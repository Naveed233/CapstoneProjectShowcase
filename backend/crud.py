from sqlalchemy.orm import Session
from backend.models import Project, Feedback
from backend.schemas import ProjectCreate, FeedbackCreate

def create_project(db: Session, project: ProjectCreate):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session):
    return db.query(Project).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def create_feedback(db: Session, feedback: FeedbackCreate, project_id: int):
    db_feedback = Feedback(**feedback.dict(), project_id=project_id)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback