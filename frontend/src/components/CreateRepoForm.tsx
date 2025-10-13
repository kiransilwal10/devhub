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
    description: "",
    visibility: "public" as "public" | "private",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

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
    setErrors({})
    setSuccessMessage("")

    try {
      // Get API base URL from environment variable
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

      const response = await fetch(`${apiBaseUrl}/api/repos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          is_private: formData.visibility === "private",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Repository created:", data)
        
        setSuccessMessage(`Repository "${formData.name}" created successfully!`)
        setFormData({ name: "", description: "", visibility: "public" })
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000)
        
        // Notify parent component
        onRepoCreated()
      } else {
        const errorData = await response.json()
        
        if (response.status === 409) {
          setErrors({ general: `Repository "${formData.name}" already exists` })
        } else if (response.status === 422) {
          setErrors({ general: "Invalid repository name format" })
        } else if (response.status === 404) {
          setErrors({ general: "User not found. Please create a test user first." })
        } else {
          setErrors({ 
            general: errorData.detail || "Failed to create repository. Please try again." 
          })
        }
      }
    } catch (error) {
      console.error("Error creating repository:", error)
      setErrors({ 
        general: "Failed to connect to server. Make sure the backend is running on http://localhost:8000" 
      })
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
        {/* Error Alert */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600" role="alert">
              {errors.general}
            </p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600" role="alert">
              {successMessage}
            </p>
          </div>
        )}

        {/* Repository Name Field */}
        <FormField
          label="Repository name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          placeholder="my-awesome-project"
          required
        />

        {/* Description Field (NEW) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Description
            <span className="text-gray-500 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="A brief description of your repository..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Visibility Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Visibility</label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
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
            <label className="flex items-center cursor-pointer">
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

        {/* Submit Button */}
        <PrimaryButton type="submit" loading={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Repository"}
        </PrimaryButton>
      </form>
    </Card>
  )
}