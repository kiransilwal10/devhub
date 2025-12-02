# backend/app/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)  # Auto-generated from email
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    repositories = relationship("Repository", back_populates="owner")

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    is_private = Column(Boolean, default=False)

    # Foreign key to User
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Gitea integration fields
    gitea_id = Column(Integer, nullable=True, unique=True)
    gitea_owner = Column(String, nullable=True)
    clone_url = Column(String, nullable=True)
    ssh_url = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationship
    owner = relationship("User", back_populates="repositories")
    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")


# ✨ NEW MODEL - Add this
class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)

    # Repository reference
    repo_id = Column(Integer, ForeignKey("repositories.id"))
    repo_name = Column(String, index=True)

    # Commit details
    sha = Column(String, unique=True, index=True)  # Git commit hash
    message = Column(Text)
    author = Column(String)
    author_email = Column(String, nullable=True)
    pusher = Column(String)  # Who pushed the commit

    # Timestamps
    timestamp = Column(DateTime)  # When commit was made
    created_at = Column(DateTime, default=datetime.utcnow)  # When we recorded it

    # URL to view commit in Gitea
    url = Column(String, nullable=True)

    # Relationship
    repository = relationship("Repository", back_populates="commits")
