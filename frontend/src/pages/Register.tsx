import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card } from "../components/Card.tsx"
import { PageHeader } from "../components/PageHeader.tsx"
import { FormField } from "../components/FormField.tsx"
import { PrimaryButton } from "../components/PrimaryButton.tsx"

export function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Mock API call - replace with actual API integration
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store token in localStorage (temporary - replace with proper auth)
        localStorage.setItem("token", data.token)
        navigate("/dashboard")
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.message || "Registration failed" })
      }
    } catch (error) {
      // For now, mock success and navigate to dashboard
      console.log("Registration attempt:", formData)
      localStorage.setItem("token", "mock-token")
      navigate("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Also clear confirmPassword error if password changes
    if (field === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">DevHub</h2>
          <PageHeader title="Create your account" subtitle="Join DevHub and start managing your projects." />
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600" role="alert">
                  {errors.general}
                </p>
              </div>
            )}

            <FormField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <FormField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              placeholder="Create a password"
              autoComplete="new-password"
              help="Must be at least 6 characters long"
              required
            />

            <FormField
              label="Confirm password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <PrimaryButton type="submit" loading={isLoading} className="w-full">
              Create account
            </PrimaryButton>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
