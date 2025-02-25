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
  const [isDisabled, setIsDisabled] = useState(true) // State to disable rating input controls

  useEffect(() => {
    fetchImages()
    // Enable inputs after the initial 3 seconds
    const timer = setTimeout(() => {
      setIsDisabled(false)
    }, 3000)

    return () => clearTimeout(timer) // Cleanup timeout
  }, [])

  async function fetchImages() {
    try {
      const { data, error } = await supabase.from("images").select("*").order("position", { ascending: true })

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

      // Disable inputs when moving to next image
      setIsDisabled(true)

      // Reset ratings and move to the next image
      setCurrentImageIndex(currentImageIndex + 1)
      setContentRating(0)
      setAestheticRating(0)

      // Re-enable inputs after 3 seconds
      const timer = setTimeout(() => {
        setIsDisabled(false)
      }, 3000)

      return () => clearTimeout(timer) // Cleanup the timer if component unmounts
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
                <RatingInput
                    label="Content Rating"
                    value={contentRating}
                    onChange={setContentRating}
                    disabled={isDisabled} // Disable based on state
                />
                <RatingInput
                    label="Aesthetic Rating"
                    value={aestheticRating}
                    onChange={setAestheticRating}
                    disabled={isDisabled} // Disable based on state
                />
              </div>
              <button
                  onClick={submitRatings}
                  className={`w-full ${
                      isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                  } text-white font-bold py-2 px-4 rounded`}
                  disabled={isDisabled} // Disable the button as well for consistency
              >
                Next
              </button>
            </>
        )}
      </div>
  )
}