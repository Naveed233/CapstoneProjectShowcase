# File: backend/main.py

from fastapi import FastAPI, HTTPException, Depends, Form, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
import os
import json

# Reset logic omitted for brevity…
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS — you already have allow_origins=["*"], so dev is fine

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/projects", response_model=schemas.Project)
async def create_project(
    # 1. Metadata
    title: str = Form(...),
    summary: str = Form(...),
    description: str = Form(...),
    building: str = Form(...),
    tags: str = Form(...),            # comma-separated
    difficulty: str = Form(...),      # “Beginner” / …
    # 2. Code & links
    repo_url: str = Form(...),
    branch: str    = Form(...),
    live_demo_url: str = Form(None),
    video_url: str     = Form(None),
    # 4. Fun prompts
    one_word: str     = Form(None),
    bug: str          = Form(None),
    next_skill: str   = Form(None),
    # 5. Versioning
    new_version_desc: str = Form(None),

    # 3. File uploads
    thumbnail: UploadFile = File(None),
    assets: list[UploadFile] = File(None),
    ci_badge: UploadFile = File(None),

    db: Session = Depends(get_db),
):
    # Save files to disk and collect URLs
    def save_upload(file: UploadFile):
        path = f"uploads/{file.filename}"
        with open(path, "wb") as f:
            f.write(file.file.read())
        return f"/uploads/{file.filename}"

    thumb_url = save_upload(thumbnail) if thumbnail else None
    asset_urls = [save_upload(f) for f in (assets or [])]
    ci_url = save_upload(ci_badge) if ci_badge else None

    # Create the Project record
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
        thumbnail_url=thumb_url,
        asset_urls=json.dumps(asset_urls),  # store as JSON text
        ci_badge_url=ci_url,
        votes=0,
    )

    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj
