import { useState } from "react"
import { TopNav } from "../components/TopNav"
import { PageHeader } from "../components/PageHeader"
import { CreateRepoForm } from "../components/CreateRepoForm"
import { RepoList } from "../components/RepoList"
import { ActivityFeed } from "../components/ActivityFeed"

export function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRepoCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageHeader title="Dashboard" subtitle="Manage your repositories and track your development activity." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Repository - Full width on mobile, 1 column on desktop */}
          <div className="lg:col-span-1">
            <CreateRepoForm onRepoCreated={handleRepoCreated} />
          </div>

          {/* My Repositories - Full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2">
            <RepoList refreshTrigger={refreshTrigger} />
          </div>

          {/* Recent Activity - Full width on mobile and desktop */}
          <div className="lg:col-span-3">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}
