# File: backend/models.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = 'users'

    id               = Column(Integer, primary_key=True)
    name             = Column(String, nullable=False)
    email            = Column(String, unique=True, nullable=False)
    profile_picture  = Column(String, nullable=True)
    role             = Column(String, default="student")
    password_hash = Column(String, nullable=False)
    teams            = relationship("TeamMember", back_populates="user")
    votes            = relationship("Vote", back_populates="user")


class Team(Base):
    __tablename__ = 'teams'

    id          = Column(Integer, primary_key=True)
    name        = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    logo_url    = Column(String, nullable=True)

    members     = relationship("TeamMember", back_populates="team")
    projects    = relationship("Project", back_populates="team")


class TeamMember(Base):
    __tablename__ = 'team_members'

    id      = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    team    = relationship("Team", back_populates="members")
    user    = relationship("User", back_populates="teams")


class Project(Base):
    __tablename__ = 'projects'

    id                = Column(Integer, primary_key=True, autoincrement=True)
    title             = Column(String(255), nullable=False)
    summary           = Column(Text,   nullable=False)
    description       = Column(Text,   nullable=False)
    building          = Column(String, nullable=True)
    members           = Column(String, nullable=True)

    # file/video URLs
    image_url         = Column(String, nullable=True)
    video_url         = Column(String, nullable=True)

    # code & demo
    github_url        = Column(String, nullable=True)
    live_demo_url     = Column(String, nullable=True)
    branch            = Column(String, nullable=True)

    # metadata
    tags              = Column(String, nullable=True)  # comma-separated
    difficulty        = Column(String, nullable=False, default="Beginner")

    # fun prompts
    one_word          = Column(String, nullable=True)
    bug               = Column(Text,   nullable=True)
    next_skill        = Column(String, nullable=True)

    # versioning
    new_version_desc  = Column(Text,   nullable=True)

    # upload URLs (saved under /uploads)
    thumbnail_url     = Column(String, nullable=True)
    asset_urls        = Column(Text,   nullable=True)  # JSON-encoded list
    ci_badge_url      = Column(String, nullable=True)

    votes             = Column(Integer, default=0)
    team_id           = Column(Integer, ForeignKey("teams.id"))

    team              = relationship("Team",   back_populates="projects")
    feedbacks         = relationship("Feedback", back_populates="project")
    voters            = relationship("Vote",    back_populates="project")


class Feedback(Base):
    __tablename__ = 'feedbacks'

    id         = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    content    = Column(Text,    nullable=False)
    author     = Column(String,  nullable=False)

    project    = relationship("Project", back_populates="feedbacks")


class Vote(Base):
    __tablename__ = "votes"

    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))

    user       = relationship("User",    back_populates="votes")
    project    = relationship("Project", back_populates="voters")

    __table_args__ = (UniqueConstraint("user_id", name="unique_user_vote"),)
