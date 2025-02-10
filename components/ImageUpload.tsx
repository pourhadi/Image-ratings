"use client"

import { useState, useTransition } from "react"
import { uploadImage } from "../app/actions"
import type React from "react" // Added import for React

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setError(null)
    setSuccess(null)

    startTransition(async () => {
      try {
        const result = await uploadImage(formData)
        if (result.success) {
          setSuccess("Image uploaded successfully!")
          setFile(null)
          // Reset the file input
          const form = e.target as HTMLFormElement
          form.reset()
        } else {
          throw new Error(result.error || "Failed to upload image")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setError("Error uploading image. Please try again.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      <button
        type="submit"
        disabled={!file || isPending}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  )
}

