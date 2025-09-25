import { useState, type FormEvent } from "react"
import { Card } from "./Card"
import { FormField } from "./FormField.tsx"
import { PrimaryButton } from "./PrimaryButton.tsx"

interface CreateRepoFormProps {
  onRepoCreated: () => void
}

export function CreateRepoForm({ onRepoCreated }: CreateRepoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    visibility: "public" as "public" | "private",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = "Repository name is required"
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      newErrors.name = "Repository name can only contain letters, numbers, hyphens, and underscores"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const clientId = localStorage.getItem("clientId") || "mock-client-id"

      const response = await fetch("/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          client_id: clientId,
        }),
      })

      if (response.ok) {
        setFormData({ name: "", visibility: "public" })
        onRepoCreated()
      } else {
        setErrors({ general: "Failed to create repository" })
      }
    } catch (error) {
      // Mock success for now
      console.log("Repository created:", formData)
      setFormData({ name: "", visibility: "public" })
      onRepoCreated()
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Repository</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600" role="alert">
              {errors.general}
            </p>
          </div>
        )}

        <FormField
          label="Repository name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          placeholder="my-awesome-project"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Visibility</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === "public"}
                onChange={(e) => handleInputChange("visibility", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                <strong>Public</strong> - Anyone can see this repository
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === "private"}
                onChange={(e) => handleInputChange("visibility", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                <strong>Private</strong> - Only you can see this repository
              </span>
            </label>
          </div>
        </div>

        <PrimaryButton type="submit" loading={isLoading} className="w-full">
          Create Repository
        </PrimaryButton>
      </form>
    </Card>
  )
}
