import { useState, useEffect } from "react"
import { Card } from "./Card"
import { Badge } from "./Badge"
import { CopyButton } from "./CopyButton"
import { LoadingSkeleton } from "./LoadingSkeleton"
import { EmptyState } from "./EmptyState"

interface Repository {
  id: string
  name: string
  visibility: "public" | "private"
  clone_urls: {
    https: string
    ssh: string
  }
}

interface RepoListProps {
  refreshTrigger: number
}

export function RepoList({ refreshTrigger }: RepoListProps) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const clientId = localStorage.getItem("clientId") || "mock-client-id"
      const response = await fetch(`/repos?client_id=${clientId}`)

      if (response.ok) {
        const data = await response.json()
        setRepos(data)
      } else {
        setError("Failed to load repositories")
      }
    } catch (error) {
      // Mock data for now
      const mockRepos: Repository[] = [
        {
          id: "1",
          name: "my-first-project",
          visibility: "public",
          clone_urls: {
            https: "https://github.com/user/my-first-project.git",
            ssh: "git@github.com:user/my-first-project.git",
          },
        },
        {
          id: "2",
          name: "secret-project",
          visibility: "private",
          clone_urls: {
            https: "https://github.com/user/secret-project.git",
            ssh: "git@github.com:user/secret-project.git",
          },
        },
      ]
      setRepos(mockRepos)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Repositories</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} lines={2} />
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
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Repositories</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clone URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repos.map((repo) => (
              <tr key={repo.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant={repo.visibility === "public" ? "success" : "default"}>{repo.visibility}</Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{repo.clone_urls.https}</code>
                    <CopyButton text={repo.clone_urls.https} />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a
                    href={`/repos/${repo.id}`}
                    className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
