import { useState, useEffect } from "react"
import { Card } from "./Card"
import { Badge } from "./Badge"
import { CopyButton } from "./CopyButton"
import { LoadingSkeleton } from "./LoadingSkeleton"
import { EmptyState } from "./EmptyState"

interface Repository {
  id: number
  name: string
  description?: string
  is_private: boolean
  owner_id: number
  gitea_id?: number
  gitea_owner?: string
  clone_url?: string
  ssh_url?: string
  created_at: string
  updated_at?: string
}

interface RepoListProps {
  refreshTrigger: number
}

export function RepoList({ refreshTrigger }: RepoListProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const fetchRepos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${apiBaseUrl}/api/repos/`)

      if (response.ok) {
        const data = await response.json()
        setRepos(data)
      } else {
        setError("Failed to load repositories")
      }
    } catch (error) {
      console.error("Error fetching repositories:", error)
      setError("Failed to connect to server. Make sure the backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [refreshTrigger])

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nThis will permanently delete the repository from Gitea and the database.`)) {
      return
    }

    setDeleteLoading(id)

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${apiBaseUrl}/api/repos/${id}`, {
        method: "DELETE",
      })

      if (response.ok || response.status === 204) {
        // Remove from local state
        setRepos((prev) => prev.filter((repo) => repo.id !== id))
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.detail || "Failed to delete repository")
      }
    } catch (error) {
      console.error("Error deleting repository:", error)
      alert("Failed to delete repository. Please try again.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const openInGitea = (cloneUrl?: string) => {
    if (!cloneUrl) return
    
    // Extract the web URL from clone URL
    // Example: http://localhost:3000/admin/repo-name.git -> http://localhost:3000/admin/repo-name
    const webUrl = cloneUrl.replace('.git', '')
    window.open(webUrl, '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Repositories</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} lines={3} />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Repositories</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
          <button
            onClick={fetchRepos}
            className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium underline"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  if (repos.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Repositories</h2>
        <EmptyState
          title="No repositories yet"
          description="Create your first repository to get started with DevHub."
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          My Repositories ({repos.length})
        </h2>
        <button
          onClick={fetchRepos}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Refresh repositories"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clone URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repos.map((repo) => (
              <tr key={repo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                  {repo.gitea_owner && (
                    <div className="text-xs text-gray-500">by {repo.gitea_owner}</div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate" title={repo.description}>
                    {repo.description || <span className="text-gray-400 italic">No description</span>}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant={repo.is_private ? "default" : "success"}>
                    {repo.is_private ? "private" : "public"}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-xs truncate" title={repo.clone_url}>
                      {repo.clone_url || "N/A"}
                    </code>
                    {repo.clone_url && <CopyButton text={repo.clone_url} />}
                  </div>
                  {repo.ssh_url && (
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-xs truncate" title={repo.ssh_url}>
                        SSH
                      </code>
                      <CopyButton text={repo.ssh_url} />
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500">{formatDate(repo.created_at)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    {repo.clone_url && (
                      <button
                        onClick={() => openInGitea(repo.clone_url)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded font-medium"
                        aria-label={`Open ${repo.name} in Gitea`}
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(repo.id, repo.name)}
                      disabled={deleteLoading === repo.id}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${repo.name}`}
                    >
                      {deleteLoading === repo.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly card view for small screens */}
      <div className="md:hidden space-y-4 mt-4">
        {repos.map((repo) => (
          <div key={repo.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{repo.name}</h3>
                {repo.gitea_owner && (
                  <p className="text-xs text-gray-500">by {repo.gitea_owner}</p>
                )}
              </div>
              <Badge variant={repo.is_private ? "default" : "success"}>
                {repo.is_private ? "private" : "public"}
              </Badge>
            </div>

            {repo.description && (
              <p className="text-sm text-gray-600">{repo.description}</p>
            )}

            <div className="space-y-2">
              {repo.clone_url && (
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                    {repo.clone_url}
                  </code>
                  <CopyButton text={repo.clone_url} />
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Created: {formatDate(repo.created_at)}
            </div>

            <div className="flex space-x-3 pt-2 border-t">
              {repo.clone_url && (
                <button
                  onClick={() => openInGitea(repo.clone_url)}
                  className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                >
                  View in Gitea
                </button>
              )}
              <button
                onClick={() => handleDelete(repo.id, repo.name)}
                disabled={deleteLoading === repo.id}
                className="text-red-600 hover:text-red-900 font-medium text-sm disabled:opacity-50"
              >
                {deleteLoading === repo.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}