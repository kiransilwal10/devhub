import httpx
import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class GiteaService:
    """Service for interacting with Gitea API"""
    
    def __init__(self):
        self.base_url = os.getenv("GITEA_URL")
        self.api_token = os.getenv("GITEA_API_TOKEN")
        self.admin_username = os.getenv("GITEA_ADMIN_USERNAME")
        
        if not all([self.base_url, self.api_token, self.admin_username]):
            raise ValueError("Gitea configuration incomplete. Check .env file.")
        
        self.headers = {
            "Authorization": f"token {self.api_token}",
            "Content-Type": "application/json"
        }
    
    async def create_repository(
        self,
        name: str,
        description: str = "",
        private: bool = False,
        owner: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new repository in Gitea"""
        owner = owner or self.admin_username
        url = f"{self.base_url}/api/v1/admin/users/{owner}/repos"
        
        payload = {
            "name": name,
            "description": description,
            "private": private,
            "auto_init": True,
            "default_branch": "main"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=payload,
                headers=self.headers,
                timeout=30.0
            )
            
            if response.status_code == 201:
                return response.json()
            elif response.status_code == 409:
                raise ValueError(f"Repository '{name}' already exists")
            else:
                raise Exception(f"Gitea API error: {response.status_code} - {response.text}")
    
    async def list_repositories(self, owner: Optional[str] = None) -> list:
        """List all repositories for a user"""
        owner = owner or self.admin_username
        url = f"{self.base_url}/api/v1/users/{owner}/repos"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, timeout=30.0)
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Gitea API error: {response.status_code}")
    
    async def delete_repository(self, owner: str, repo_name: str) -> bool:
        """Delete a repository from Gitea"""
        url = f"{self.base_url}/api/v1/repos/{owner}/{repo_name}"
        
        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=self.headers, timeout=30.0)
            
            return response.status_code == 204

# Singleton instance
gitea_service = GiteaService()