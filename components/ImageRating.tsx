"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase-client"
import RatingInput from "./RatingInput"

export default function ImageRating() {
  const [images, setImages] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contentRating, setContentRating] = useState(0)
  const [aestheticRating, setAestheticRating] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      setImages(data || [])
    } catch (error) {
      console.error("Error fetching images:", error)
      setError("Failed to fetch images. Please try again later.")
    }
  }

  async function submitRatings() {
    if (currentImageIndex >= images.length) return

    try {
      const { error } = await supabase.from("ratings").insert({
        image_id: images[currentImageIndex].id,
        content_rating: contentRating,
        aesthetic_rating: aestheticRating,
      })

      if (error) {
        throw error
      }

      setCurrentImageIndex(currentImageIndex + 1)
      setContentRating(0)
      setAestheticRating(0)
      setError(null)
    } catch (error) {
      console.error("Error submitting ratings:", error)
      setError("Failed to submit ratings. Please try again.")
    }
  }

  if (images.length === 0 && !error) {
    return <div>Loading images...</div>
  }

  if (currentImageIndex >= images.length && !error) {
    return <div>No more images to rate. Thank you!</div>
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {!error && images.length > 0 && (
        <>
          <img
            src={images[currentImageIndex].url || "/placeholder.svg?height=400&width=600"}
            alt={`Image ${currentImageIndex + 1}`}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="space-y-4">
            <RatingInput label="Content Rating" value={contentRating} onChange={setContentRating} />
            <RatingInput label="Aesthetic Rating" value={aestheticRating} onChange={setAestheticRating} />
          </div>
          <button
            onClick={submitRatings}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Ratings
          </button>
        </>
      )}
    </div>
  )
}

