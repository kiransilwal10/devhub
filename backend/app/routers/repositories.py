from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.services.gitea_service import gitea_service

router = APIRouter(
    prefix="/api/repos",
    tags=["repositories"]
)

@router.post("/", response_model=schemas.RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def create_repository(
    repo_data: schemas.RepositoryCreate,
    db: Session = Depends(get_db)
):
    """Create a new repository"""
    try:
        # Temporary: use hardcoded user ID (will fix with auth later)
        user_id = 1
        
        # Check if user exists
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if repository already exists
        existing_repo = db.query(models.Repository).filter(
            models.Repository.name == repo_data.name,
            models.Repository.owner_id == user_id
        ).first()
        
        if existing_repo:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Repository '{repo_data.name}' already exists"
            )
        
        # Create in Gitea
        gitea_repo = await gitea_service.create_repository(
            name=repo_data.name,
            description=repo_data.description or "",
            private=repo_data.is_private
        )
        
        # Save to database
        db_repo = models.Repository(
            name=repo_data.name,
            description=repo_data.description,
            is_private=repo_data.is_private,
            owner_id=user_id,
            gitea_id=gitea_repo.get("id"),
            gitea_owner=gitea_repo.get("owner", {}).get("login"),
            clone_url=gitea_repo.get("clone_url"),
            ssh_url=gitea_repo.get("ssh_url")
        )
        
        db.add(db_repo)
        db.commit()
        db.refresh(db_repo)
        
        return db_repo
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create repository: {str(e)}"
        )

@router.get("/", response_model=List[schemas.RepositoryResponse])
def list_repositories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all repositories"""
    repos = db.query(models.Repository).offset(skip).limit(limit).all()
    return repos

@router.get("/{repo_id}", response_model=schemas.RepositoryResponse)
def get_repository(repo_id: int, db: Session = Depends(get_db)):
    """Get repository by ID"""
    repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return repo

@router.delete("/{repo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repository(repo_id: int, db: Session = Depends(get_db)):
    """Delete a repository"""
    repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    
    # Delete from Gitea
    try:
        if repo.gitea_owner and repo.name:
            await gitea_service.delete_repository(repo.gitea_owner, repo.name)
    except Exception as e:
        print(f"Warning: Failed to delete from Gitea: {e}")
    
    # Delete from database
    db.delete(repo)
    db.commit()
    
    return None