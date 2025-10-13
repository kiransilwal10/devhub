from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RepositoryCreate(BaseModel):
    """Schema for creating a repository"""
    name: str = Field(..., min_length=1, max_length=100, pattern="^[a-zA-Z0-9_-]+$")
    description: Optional[str] = Field(None, max_length=500)
    is_private: bool = False

class RepositoryResponse(BaseModel):
    """Schema for repository response"""
    id: int
    name: str
    description: Optional[str]
    is_private: bool
    owner_id: int
    gitea_id: Optional[int] = None
    clone_url: Optional[str] = None
    ssh_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True