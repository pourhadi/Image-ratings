"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase-client"

interface Image {
  id: number
  url: string
  ratings: {
    content_rating: number
    aesthetic_rating: number
  }[]
}

export default function ImageThumbnailList() {
  const [images, setImages] = useState<Image[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImagesWithRatings()
  }, [])

  async function fetchImagesWithRatings() {
    try {
      const { data, error } = await supabase
        .from("images")
        .select(`
          id,
          url,
          ratings (
            content_rating,
            aesthetic_rating
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setImages(data || [])
    } catch (error) {
      console.error("Error fetching images with ratings:", error)
      setError("Failed to fetch images. Please try again later.")
    }
  }

  function calculateAverageRating(ratings: { content_rating: number; aesthetic_rating: number }[]) {
    if (ratings.length === 0) return "No ratings"
    const sum = ratings.reduce((acc, rating) => acc + rating.content_rating + rating.aesthetic_rating, 0)
    return (sum / (ratings.length * 2)).toFixed(1)
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm">
          <img src={image.url || "/placeholder.svg"} alt={`Image ${image.id}`} className="w-full h-40 object-cover" />
          <div className="p-2 bg-gray-100">
            <p className="text-sm font-semibold">ID: {image.id}</p>
            <p className="text-sm">Avg Rating: {calculateAverageRating(image.ratings)}</p>
            <p className="text-xs text-gray-600">Total Ratings: {image.ratings.length}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

