import { type ReactNode, type InputHTMLAttributes, forwardRef } from "react"

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  help?: string
  children?: ReactNode
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, help, children, className = "", ...props }, ref) => {
    const inputId = props.id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`
    const errorId = error ? `${inputId}-error` : undefined
    const helpId = help ? `${inputId}-help` : undefined

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-900">
          {label}
        </label>
        {children || (
          <input
            ref={ref}
            id={inputId}
            aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
            aria-invalid={error ? "true" : undefined}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
            } ${className}`}
            {...props}
          />
        )}
        {help && (
          <p id={helpId} className="text-sm text-gray-600">
            {help}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = "FormField"
