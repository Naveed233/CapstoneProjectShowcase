from pydantic import BaseModel
from typing import Optional, List
import models

# --- User ---
class UserBase(BaseModel):
    name: str
    email: str
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    role: Optional[str] = "student"

    class Config:
        orm_mode = True


# --- Feedback ---
class FeedbackBase(BaseModel):
    content: str
    author: str

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True


# --- Project ---

class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    members: Optional[str] = None
    building: Optional[str] = None  

class ProjectCreate(ProjectBase):
    team_id: int

class Project(ProjectBase):
    id: int
    votes: int
    team_id: int
    feedbacks: List[Feedback] = []
    building: Optional[str] = None   # ✅ ADD THIS
    members: Optional[str] = None    # ✅ ADD THIS

    class Config:
        orm_mode = True

# --- Team ---
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    members: List['TeamMember'] = []
    projects: List[Project] = []

    class Config:
        orm_mode = True


# --- Team Member ---
class TeamMemberBase(BaseModel):
    team_id: int
    user_id: int

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id: int
    user: User

    class Config:
        orm_mode = True


# --- Vote ---
class Vote(BaseModel):
    id: int
    user_id: int
    project_id: int

    class Config:
        orm_mode = True


# For forward references
Team.update_forward_refs()
