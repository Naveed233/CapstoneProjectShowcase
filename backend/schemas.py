# File: backend/schemas.py

from pydantic import BaseModel
from typing  import Optional, List


# --- Feedback ---
class FeedbackBase(BaseModel):
    content: str
    author:  str

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id:         int
    project_id: int

    class Config:
        orm_mode = True


# --- Project ---
class ProjectBase(BaseModel):
    title:            str
    summary:          str
    description:      str
    building:         Optional[str] = None
    members:          Optional[str] = None

    image_url:        Optional[str] = None
    video_url:        Optional[str] = None

    github_url:       Optional[str] = None
    live_demo_url:    Optional[str] = None
    branch:           Optional[str] = None

    tags:             Optional[str] = None
    difficulty:       Optional[str] = "Beginner"

    one_word:         Optional[str] = None
    bug:              Optional[str] = None
    next_skill:       Optional[str] = None

    new_version_desc: Optional[str] = None

    thumbnail_url:    Optional[str] = None
    asset_urls:       Optional[str] = None  # JSON list
    ci_badge_url:     Optional[str] = None


class ProjectCreate(ProjectBase):
    team_id: int


class Project(ProjectBase):
    id:       int
    votes:    int
    team_id:  int
    feedbacks: List[Feedback] = []

    class Config:
        orm_mode = True


# --- User ---
class UserBase(BaseModel):
    name:             str
    email:            str
    profile_picture:  Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id:   int
    role: Optional[str] = "student"

    class Config:
        orm_mode = True
# --- Auth Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type:   str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Team ---
class TeamBase(BaseModel):
    name:        str
    description: Optional[str] = None
    logo_url:    Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int

    class Config:
        orm_mode = True


# --- Team Member ---
class TeamMemberBase(BaseModel):
    team_id: int
    user_id: int

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id:   int
    user: User

    class Config:
        orm_mode = True


# --- Vote ---
class Vote(BaseModel):
    id:         int
    user_id:    int
    project_id: int

    class Config:
        orm_mode = True
