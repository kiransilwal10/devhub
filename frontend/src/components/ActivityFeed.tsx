import { useState, useEffect } from "react"
import { Card } from "./Card"
import { LoadingSkeleton } from "./LoadingSkeleton.tsx"
import { EmptyState } from "./EmptyState.tsx"

interface Activity {
  id: string
  repo: string
  branch: string
  actor: string
  at: string
  action: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const clientId = localStorage.getItem("clientId") || "mock-client-id"
      const response = await fetch(`/activities?client_id=${clientId}`)

      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      } else {
        setError("Failed to load activities")
      }
    } catch (error) {
      // Mock data for now
      const mockActivities: Activity[] = [
        {
          id: "1",
          repo: "my-first-project",
          branch: "main",
          actor: "john.doe",
          at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          action: "pushed to",
        },
        {
          id: "2",
          repo: "secret-project",
          branch: "feature/auth",
          actor: "jane.smith",
          at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          action: "created branch",
        },
        {
          id: "3",
          repo: "my-first-project",
          branch: "main",
          actor: "john.doe",
          at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          action: "merged PR to",
        },
      ]
      setActivities(mockActivities)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        </div>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <EmptyState
          title="No recent activity"
          description="Activity from your repositories will appear here."
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
                <span className="font-medium">{activity.branch}</span> in{" "}
                <span className="font-medium text-blue-600">{activity.repo}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.at)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
