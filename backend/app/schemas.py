# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    username: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Repository Schemas
class RepositoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_private: bool = False

class RepositoryCreate(RepositoryBase):
    pass

class Repository(RepositoryBase):
    id: int
    owner_id: int
    gitea_id: Optional[int] = None
    gitea_owner: Optional[str] = None
    clone_url: Optional[str] = None
    ssh_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

RepositoryResponse = Repository

# ✨ NEW SCHEMAS - Add these
class CommitBase(BaseModel):
    repo_id: int
    repo_name: str
    sha: str
    message: str
    author: str
    author_email: Optional[str] = None
    pusher: str
    timestamp: datetime
    url: Optional[str] = None

class CommitCreate(CommitBase):
    pass

class Commit(CommitBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Webhook Schemas
class WebhookPayload(BaseModel):
    """Schema for Gitea webhook payload"""
    ref: Optional[str] = None
    before: Optional[str] = None
    after: Optional[str] = None
    compare_url: Optional[str] = None
    commits: list = []
    repository: dict = {}
    pusher: dict = {}
    sender: dict = {}
