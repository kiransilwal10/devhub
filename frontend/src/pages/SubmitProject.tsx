import type React from "react"

import { useState } from "react"
import { TopNav } from "../components/TopNav"
import { PageHeader } from "../components/PageHeader"
import { PrimaryButton } from "../components/PrimaryButton"
import { SecondaryButton } from "../components/SecondaryButton"
import { FormField } from "../components/FormField"
import { Card } from "../components/Card"

export function SubmitProject() {
  const [repoName, setRepoName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [initializeWithReadme, setInitializeWithReadme] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadMethod, setUploadMethod] = useState("files")
  const [gitUrl, setGitUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement repository creation with file upload
      console.log("Creating repository:", {
        repoName,
        description,
        visibility,
        initializeWithReadme,
        selectedFiles,
        uploadMethod,
        gitUrl,
      })

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message or redirect
      alert("Repository created successfully!")
    } catch (error) {
      console.error("Error creating repository:", error)
      alert("Failed to create repository. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageHeader title="Submit Project" subtitle="Create a new repository and upload your project files." />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Repository Details */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Repository Details</h3>
                </div>

                <FormField
                  label="Repository name"
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-awesome-project"
                  help="Great repository names are short and memorable."
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your project..."
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900">Visibility</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={visibility === "public"}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Public - Anyone can see this repository
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={visibility === "private"}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Private - Only you can see this repository
                      </span>
                    </label>
                  </div>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={initializeWithReadme}
                    onChange={(e) => setInitializeWithReadme(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Initialize with README
                  </span>
                </label>
              </div>
            </Card>

            {/* Upload Method */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Method</h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="files"
                      checked={uploadMethod === "files"}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Upload files</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="folder"
                      checked={uploadMethod === "folder"}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Upload folder</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadMethod"
                      value="git"
                      checked={uploadMethod === "git"}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Import from Git URL</span>
                  </label>
                </div>

                {uploadMethod === "files" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Select files</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedFiles && <p className="text-sm text-gray-500">{selectedFiles.length} file(s) selected</p>}
                  </div>
                )}

                {uploadMethod === "folder" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Select folder</label>
                    <input
                      type="file"
                      // @ts-ignore - webkitdirectory is not in types but works
                      webkitdirectory=""
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                )}

                {uploadMethod === "git" && (
                  <FormField
                    label="Git repository URL"
                    type="url"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    placeholder="https://github.com/user/repo.git"
                  />
                )}
              </div>
            </Card>
          </div>

          {/* File Preview */}
          {selectedFiles && selectedFiles.length > 0 && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Files to Upload ({selectedFiles.length})</h3>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>{file.name}</span>
                        <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <SecondaryButton type="button" onClick={() => window.history.back()}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" loading={isLoading} disabled={!repoName.trim()}>
              Create Repository
            </PrimaryButton>
          </div>
        </form>
      </main>
    </div>
  )
}
