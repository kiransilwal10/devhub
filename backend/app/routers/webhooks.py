from fastapi import APIRouter, Request, HTTPException, Header
from typing import Optional
import json
from datetime import datetime
from app.database import SessionLocal
from app.models import Commit, Repository
import sys

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/gitea")
async def gitea_webhook(
    request: Request,
    x_gitea_signature: Optional[str] = Header(None),
    x_gitea_event: Optional[str] = Header(None)
):
    # PRINT TO STDOUT - THIS WILL DEFINITELY SHOW IN LOGS
    print("\n" + "="*80, flush=True)
    print("🚀🚀🚀 WEBHOOK HIT!!!", flush=True)
    print("="*80, flush=True)
    print(f"Event: {x_gitea_event}", flush=True)
    
    body = await request.body()
    print(f"Body size: {len(body)} bytes", flush=True)
    
    try:
        payload = json.loads(body)
        repo_name = payload.get("repository", {}).get("name", "unknown")
        commits_count = len(payload.get("commits", []))
        print(f"Repository: {repo_name}", flush=True)
        print(f"Commits: {commits_count}", flush=True)
    except:
        print("ERROR parsing JSON", flush=True)
        raise HTTPException(400, "Invalid JSON")
    
    if x_gitea_event != "push":
        print(f"Ignoring event: {x_gitea_event}", flush=True)
        return {"message": "Not a push event"}
    
    commits_data = payload.get("commits", [])
    if not commits_data:
        print("No commits in payload", flush=True)
        return {"message": "No commits"}
    
    # Find repo
    db = SessionLocal()
    try:
        db_repo = db.query(Repository).filter(Repository.name == repo_name).first()
        
        if not db_repo:
            print(f"ERROR: Repo '{repo_name}' not found in database!", flush=True)
            raise HTTPException(404, f"Repo '{repo_name}' not found")
        
        print(f"Found repo ID: {db_repo.id}", flush=True)
        
        # Process commits
        saved = 0
        for commit_data in commits_data:
            sha = commit_data.get("id")
            
            # Skip if exists
            if db.query(Commit).filter(Commit.sha == sha).first():
                print(f"Commit {sha[:7]} exists, skipping", flush=True)
                continue
            
            # Parse timestamp
            try:
                ts_str = commit_data.get("timestamp")
                timestamp = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
            except:
                timestamp = datetime.utcnow()
            
            # Create commit
            new_commit = Commit(
                repo_id=db_repo.id,
                repo_name=repo_name,
                sha=sha,
                message=commit_data.get("message", ""),
                author=commit_data.get("author", {}).get("name", "unknown"),
                author_email=commit_data.get("author", {}).get("email"),
                pusher=payload.get("pusher", {}).get("username", "unknown"),
                timestamp=timestamp,
                url=commit_data.get("url")
            )
            
            db.add(new_commit)
            saved += 1
            print(f"Saving commit: {sha[:7]}", flush=True)
        
        db.commit()
        print(f"✅ SUCCESS: Saved {saved} commits", flush=True)
        print("="*80 + "\n", flush=True)
        
        return {
            "message": "Success",
            "saved": saved
        }
        
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}", flush=True)
        raise HTTPException(500, str(e))
    finally:
        db.close()


@router.get("/test")
def test_webhook_endpoint():
    print("✅ TEST ENDPOINT HIT", flush=True)
    return {"message": "Working", "timestamp": datetime.utcnow().isoformat()}