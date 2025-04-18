# backend/main.py

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

from fastapi.middleware.cors import CORSMiddleware
models.Base.metadata.drop_all(bind=engine)  # ⚠️ Wipes tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain on prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Project Routes ---
@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@app.get("/projects", response_model=list[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()


@app.get("/projects/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# --- Feedback Routes ---
@app.post("/projects/{project_id}/feedback", response_model=schemas.Feedback)
def add_feedback(project_id: int, feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(**feedback.dict(), project_id=project_id)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


@app.get("/projects/{project_id}/feedback", response_model=list[schemas.Feedback])
def get_feedback(project_id: int, db: Session = Depends(get_db)):
    return db.query(models.Feedback).filter(models.Feedback.project_id == project_id).all()


# --- Vote Route ---
@app.post("/projects/{project_id}/vote")
def vote_project(project_id: int, user_id: int, db: Session = Depends(get_db)):
    existing_vote = db.query(models.Vote).filter(models.Vote.user_id == user_id).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="User has already voted")

    vote = models.Vote(user_id=user_id, project_id=project_id)
    db.add(vote)

    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.votes += 1

    db.commit()
    return {"message": "Vote added successfully", "votes": project.votes}


# --- User Routes ---
@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# --- Team Routes ---
@app.post("/teams", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@app.get("/teams", response_model=list[schemas.Team])
def get_teams(db: Session = Depends(get_db)):
    return db.query(models.Team).all()


@app.get("/teams/{team_id}", response_model=schemas.Team)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@app.post("/teams/{team_id}/add-member", response_model=schemas.TeamMember)
def add_team_member(team_id: int, member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    db_member = models.TeamMember(team_id=team_id, user_id=member.user_id)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member
