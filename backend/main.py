# File: backend/main.py

import os
import json
from datetime import datetime, timedelta
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import (
    FastAPI, HTTPException, Depends, Query, status,
    Form, File, UploadFile
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import SessionLocal, engine, Base
from . import models, schemas

# 1) Load .env
load_dotenv()

# 2) Create DB tables
Base.metadata.create_all(bind=engine)

# 3) Instantiate FastAPI BEFORE any routes
app = FastAPI()

# 4) Add CORS middleware right away
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # replace "*" with your frontends in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5) Serve uploaded files
if not os.path.isdir("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 6) DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- JWT / Auth Setup ---
SECRET_KEY = os.getenv("SECRET_KEY", "change_this_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta]=None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    creds_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise creds_exc
    except JWTError:
        raise creds_exc
    user = get_user_by_email(db, email)
    if user is None:
        raise creds_exc
    return user


# --- Auth Endpoints ---
@app.post("/signup", response_model=schemas.User)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user_in.password)
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed,
        profile_picture=user_in.profile_picture
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# --- Project Routes ---
@app.post("/projects", response_model=schemas.Project)
async def create_project(
    title: str = Form(...),
    summary: str = Form(...),
    description: str = Form(...),
    building: str = Form(...),
    tags: str = Form(...),
    difficulty: str = Form(...),
    repo_url: str = Form(...),
    branch: str    = Form(...),
    live_demo_url: str = Form(None),
    video_url: str     = Form(None),
    one_word: str     = Form(None),
    bug: str          = Form(None),
    next_skill: str   = Form(None),
    new_version_desc: str = Form(None),
    thumbnail: UploadFile = File(None),
    assets: List[UploadFile] = File(None),
    ci_badge: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    def save(f: UploadFile):
        path = f"uploads/{f.filename}"
        with open(path, "wb") as dest:
            dest.write(f.file.read())
        return f"/uploads/{f.filename}"

    thumb = save(thumbnail) if thumbnail else None
    asset_list = [save(f) for f in (assets or [])]
    ci    = save(ci_badge) if ci_badge else None

    proj = models.Project(
        title=title,
        summary=summary,
        description=description,
        building=building,
        tags=tags,
        difficulty=difficulty,
        repo_url=repo_url,
        branch=branch,
        live_demo_url=live_demo_url,
        video_url=video_url,
        one_word=one_word,
        bug=bug,
        next_skill=next_skill,
        new_version_desc=new_version_desc,
        thumbnail_url=thumb,
        asset_urls=json.dumps(asset_list),
        ci_badge_url=ci,
        votes=0,
        team_id=None
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj

@app.get("/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/projects/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    proj = db.get(models.Project, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj
