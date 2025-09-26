"use client"

import { useState } from "react"
import { TopNav } from "../components/TopNav"
import { PageHeader } from "../components/PageHeader"
import { SecondaryButton } from "../components/SecondaryButton"
import { Card } from "../components/Card"
import { Badge } from "../components/Badge"
import { CopyButton } from "../components/CopyButton"
import { Search, GitBranch, Star, Globe, Lock, Code, FileText, Download, Eye, GitCommit, Users } from "lucide-react"

// Mock data for repositories
const mockRepositories = [
  {
    id: 1,
    name: "my-first-project",
    description: "A simple web application built with React and Node.js",
    visibility: "public",
    language: "JavaScript",
    stars: 12,
    forks: 3,
    lastCommit: "2 hours ago",
    size: "2.3 MB",
    commits: 45,
    branches: 3,
    contributors: 2,
  },
  {
    id: 2,
    name: "secret-project",
    description: "Private project for client work",
    visibility: "private",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    lastCommit: "1 day ago",
    size: "5.7 MB",
    commits: 23,
    branches: 2,
    contributors: 1,
  },
  {
    id: 3,
    name: "data-analysis-tool",
    description: "Python tool for analyzing large datasets",
    visibility: "public",
    language: "Python",
    stars: 28,
    forks: 7,
    lastCommit: "3 days ago",
    size: "1.8 MB",
    commits: 67,
    branches: 4,
    contributors: 3,
  },
]

export function ViewRepositories() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<(typeof mockRepositories)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const filteredRepos = mockRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRepoSelect = (repo: (typeof mockRepositories)[0]) => {
    setSelectedRepo(repo)
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
    }
    return colors[language] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageHeader title="Projects" subtitle="Browse and manage your repositories." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repository List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Your Repositories</h3>
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
                {filteredRepos.map((repo) => (
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
                          {repo.visibility === "private" ? (
                            <Lock className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Globe className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                            <span className="text-xs text-gray-500">{repo.language}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{repo.stars}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Repository Details */}
          <div className="lg:col-span-2">
            {selectedRepo ? (
              <Card>
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">{selectedRepo.name}</h2>
                        <Badge variant={selectedRepo.visibility === "public" ? "default" : "warning"}>
                          {selectedRepo.visibility}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{selectedRepo.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <SecondaryButton>
                        <Star className="h-4 w-4 mr-1" />
                        Star
                      </SecondaryButton>
                      <SecondaryButton>
                        <Download className="h-4 w-4 mr-1" />
                        Clone
                      </SecondaryButton>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b mb-6">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "files", label: "Files" },
                      { id: "commits", label: "Commits" },
                      { id: "branches", label: "Branches" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <GitCommit className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                          <div className="text-lg font-semibold">{selectedRepo.commits}</div>
                          <div className="text-xs text-gray-500">Commits</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <GitBranch className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                          <div className="text-lg font-semibold">{selectedRepo.branches}</div>
                          <div className="text-xs text-gray-500">Branches</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                          <div className="text-lg font-semibold">{selectedRepo.contributors}</div>
                          <div className="text-xs text-gray-500">Contributors</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Eye className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                          <div className="text-lg font-semibold">{selectedRepo.size}</div>
                          <div className="text-xs text-gray-500">Size</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Clone URLs</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={`https://github.com/user/${selectedRepo.name}.git`}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                            />
                            <CopyButton text={`https://github.com/user/${selectedRepo.name}.git`} />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={`git@github.com:user/${selectedRepo.name}.git`}
                              readOnly
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                            />
                            <CopyButton text={`git@github.com:user/${selectedRepo.name}.git`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "files" && (
                    <div className="space-y-4">
                      <div className="border rounded-lg">
                        <div className="p-3 border-b bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Files</span>
                            <span className="text-sm text-gray-500">Last commit {selectedRepo.lastCommit}</span>
                          </div>
                        </div>
                        <div className="divide-y">
                          {[
                            { name: "README.md", type: "file", size: "2.1 KB" },
                            { name: "src/", type: "folder", size: "-" },
                            { name: "package.json", type: "file", size: "1.3 KB" },
                            { name: "tsconfig.json", type: "file", size: "0.8 KB" },
                            { name: ".gitignore", type: "file", size: "0.2 KB" },
                          ].map((item, index) => (
                            <div key={index} className="p-3 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {item.type === "folder" ? (
                                    <Code className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-gray-500" />
                                  )}
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{item.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "commits" && (
                    <div className="space-y-3">
                      {[
                        {
                          message: "Add user authentication",
                          author: "john.doe",
                          time: "2 hours ago",
                          hash: "a1b2c3d",
                        },
                        {
                          message: "Update README with installation instructions",
                          author: "jane.smith",
                          time: "1 day ago",
                          hash: "e4f5g6h",
                        },
                        {
                          message: "Fix responsive design issues",
                          author: "john.doe",
                          time: "2 days ago",
                          hash: "i7j8k9l",
                        },
                      ].map((commit, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{commit.message}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {commit.author} committed {commit.time}
                              </p>
                            </div>
                            <Badge variant="default">
                              <span className="font-mono text-xs">{commit.hash}</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "branches" && (
                    <div className="space-y-3">
                      {[
                        { name: "main", isDefault: true, lastCommit: "2 hours ago", ahead: 0, behind: 0 },
                        { name: "feature/auth", isDefault: false, lastCommit: "1 day ago", ahead: 3, behind: 1 },
                        { name: "develop", isDefault: false, lastCommit: "3 days ago", ahead: 0, behind: 2 },
                      ].map((branch, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-sm">{branch.name}</span>
                              {branch.isDefault && (
                                <Badge variant="success">
                                  <span className="text-xs">default</span>
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">Updated {branch.lastCommit}</div>
                          </div>
                          {!branch.isDefault && (
                            <div className="mt-2 text-xs text-gray-500">
                              {branch.ahead} ahead, {branch.behind} behind main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-center h-64 p-6">
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Repository</h3>
                    <p className="text-gray-500">Choose a repository from the list to view its details.</p>
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
