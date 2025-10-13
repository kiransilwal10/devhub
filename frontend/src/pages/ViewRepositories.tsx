"use client"

import { useState, useEffect } from "react"
import { TopNav } from "../components/TopNav"
import { PageHeader } from "../components/PageHeader"
import { SecondaryButton } from "../components/SecondaryButton"
import { Card } from "../components/Card"
import { Badge } from "../components/Badge"
import { CopyButton } from "../components/CopyButton"
import { LoadingSkeleton } from "../components/LoadingSkeleton"
import { Search, GitBranch, Star, Globe, Lock, Code, FileText, Download, Eye, GitCommit, Users, Trash2, ExternalLink } from "lucide-react"
import { repoApi } from "../lib/api"
import type { Repository } from "../lib/api"

export function ViewRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch repositories on mount
  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await repoApi.list()
      setRepositories(data)
      
      // Auto-select first repo if available
      if (data.length > 0 && !selectedRepo) {
        setSelectedRepo(data[0])
      }
    } catch (err: any) {
      setError(err.message || "Failed to load repositories")
      console.error("Error fetching repositories:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo)
    setActiveTab("overview") // Reset to overview tab when selecting new repo
  }

  const handleDelete = async () => {
    if (!selectedRepo) return
    
    if (!window.confirm(`Are you sure you want to delete "${selectedRepo.name}"?\n\nThis will permanently delete the repository from Gitea and the database.`)) {
      return
    }

    setDeleteLoading(true)

    try {
      await repoApi.delete(selectedRepo.id)
      
      // Remove from local state
      setRepositories((prev) => prev.filter((repo) => repo.id !== selectedRepo.id))
      
      // Select next available repo or null
      const remainingRepos = repositories.filter((repo) => repo.id !== selectedRepo.id)
      setSelectedRepo(remainingRepos.length > 0 ? remainingRepos[0] : null)
      
      alert(`Repository "${selectedRepo.name}" deleted successfully!`)
    } catch (err: any) {
      alert(err.message || "Failed to delete repository")
      console.error("Error deleting repository:", err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const openInGitea = () => {
    if (!selectedRepo?.clone_url) return
    const webUrl = selectedRepo.clone_url.replace('.git', '')
    window.open(webUrl, '_blank', 'noopener,noreferrer')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getLanguageColor = (language?: string) => {
    if (!language) return "bg-gray-500"
    
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      Ruby: "bg-red-600",
    }
    return colors[language] || "bg-gray-500"
  }

  const detectLanguage = (repoName: string): string => {
    // Simple language detection based on common patterns
    const name = repoName.toLowerCase()
    if (name.includes('react') || name.includes('vue') || name.includes('angular')) return 'JavaScript'
    if (name.includes('ts') || name.includes('typescript')) return 'TypeScript'
    if (name.includes('py') || name.includes('python') || name.includes('django') || name.includes('flask')) return 'Python'
    if (name.includes('go') || name.includes('golang')) return 'Go'
    if (name.includes('rust')) return 'Rust'
    return 'JavaScript' // Default
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Projects" 
          subtitle={`Browse and manage your repositories (${repositories.length} total)`} 
        />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchRepositories}
              className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repository List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Repositories</h3>
                  <button
                    onClick={fetchRepositories}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                    aria-label="Refresh repositories"
                  >
                    ↻ Refresh
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <LoadingSkeleton key={i} lines={3} />
                    ))}
                  </div>
                ) : filteredRepos.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {searchTerm ? 'No repositories match your search' : 'No repositories yet'}
                  </div>
                ) : (
                  filteredRepos.map((repo) => {
                    const language = detectLanguage(repo.name)
                    return (
                      <div
                        key={repo.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedRepo?.id === repo.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => handleRepoSelect(repo)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">{repo.name}</h3>
                              {repo.is_private ? (
                                <Lock className="h-3 w-3 text-gray-400" />
                              ) : (
                                <Globe className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {repo.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getLanguageColor(language)}`} />
                                <span className="text-xs text-gray-500">{language}</span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDate(repo.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Repository Details */}
          <div className="lg:col-span-2">
            {selectedRepo ? (
              <Card>
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <GitBranch className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">{selectedRepo.name}</h2>
                        <Badge variant={selectedRepo.is_private ? "warning" : "success"}>
                          {selectedRepo.is_private ? "private" : "public"}
                        </Badge>
                        {selectedRepo.gitea_owner && (
                          <span className="text-sm text-gray-500">by {selectedRepo.gitea_owner}</span>
                        )}
                      </div>
                      <p className="text-gray-600">{selectedRepo.description || 'No description provided'}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <SecondaryButton onClick={openInGitea}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open in Gitea
                      </SecondaryButton>
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b mb-6 overflow-x-auto">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "clone", label: "Clone URLs" },
                      { id: "info", label: "Repository Info" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <GitBranch className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <div className="text-2xl font-semibold">{selectedRepo.gitea_id || 'N/A'}</div>
                          <div className="text-xs text-gray-500">Repository ID</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Eye className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <div className="text-2xl font-semibold">{selectedRepo.is_private ? 'Private' : 'Public'}</div>
                          <div className="text-xs text-gray-500">Visibility</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <div className="text-2xl font-semibold">{selectedRepo.gitea_owner || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">Owner</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Repository Details</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">{new Date(selectedRepo.created_at).toLocaleString()}</span>
                          </div>
                          {selectedRepo.updated_at && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Updated:</span>
                              <span className="font-medium">{new Date(selectedRepo.updated_at).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Database ID:</span>
                            <span className="font-medium">#{selectedRepo.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Code className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Ready to code?</h4>
                            <p className="text-sm text-blue-700">
                              Clone this repository to your local machine and start working on it.
                              Use the "Clone URLs" tab to get the HTTPS or SSH clone URL.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "clone" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Clone with HTTPS</h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={selectedRepo.clone_url || 'Not available'}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                          />
                          {selectedRepo.clone_url && <CopyButton text={selectedRepo.clone_url} />}
                        </div>
                        <p className="text-sm text-gray-600">
                          Use this URL to clone the repository using HTTPS protocol.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Clone with SSH</h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={selectedRepo.ssh_url || 'Not available'}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                          />
                          {selectedRepo.ssh_url && <CopyButton text={selectedRepo.ssh_url} />}
                        </div>
                        <p className="text-sm text-gray-600">
                          Use this URL to clone the repository using SSH protocol (requires SSH key setup).
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Quick Start</h4>
                        <div className="space-y-2">
                          <code className="block text-sm bg-white p-3 rounded border">
                            git clone {selectedRepo.clone_url || 'URL'}
                          </code>
                          <code className="block text-sm bg-white p-3 rounded border">
                            cd {selectedRepo.name}
                          </code>
                          <code className="block text-sm bg-white p-3 rounded border">
                            git status
                          </code>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "info" && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Repository Information</h4>
                        <div className="border rounded-lg divide-y">
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Full Name:</span>
                            <span className="text-sm font-medium">{selectedRepo.gitea_owner}/{selectedRepo.name}</span>
                          </div>
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Repository ID:</span>
                            <span className="text-sm font-medium">#{selectedRepo.id}</span>
                          </div>
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Gitea ID:</span>
                            <span className="text-sm font-medium">{selectedRepo.gitea_id || 'N/A'}</span>
                          </div>
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Owner ID:</span>
                            <span className="text-sm font-medium">#{selectedRepo.owner_id}</span>
                          </div>
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Visibility:</span>
                            <Badge variant={selectedRepo.is_private ? "warning" : "success"}>
                              {selectedRepo.is_private ? "Private" : "Public"}
                            </Badge>
                          </div>
                          <div className="p-3 flex justify-between">
                            <span className="text-sm text-gray-600">Created:</span>
                            <span className="text-sm font-medium">{formatDate(selectedRepo.created_at)}</span>
                          </div>
                          {selectedRepo.updated_at && (
                            <div className="p-3 flex justify-between">
                              <span className="text-sm text-gray-600">Last Updated:</span>
                              <span className="text-sm font-medium">{formatDate(selectedRepo.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedRepo.description && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Description</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{selectedRepo.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-center h-96 p-6">
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {repositories.length === 0 ? 'No Repositories Yet' : 'Select a Repository'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {repositories.length === 0 
                        ? 'Create your first repository to get started.'
                        : 'Choose a repository from the list to view its details.'}
                    </p>
                    {repositories.length === 0 && (
                      <SecondaryButton onClick={() => window.location.href = '/create-repository'}>
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Repository
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}