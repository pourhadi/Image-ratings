"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase-client"
import { deleteImage } from "../app/actions"

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

  function calculateAverageRatings(ratings: { content_rating: number; aesthetic_rating: number }[]) {
    if (ratings.length === 0) return { content: "N/A", aesthetic: "N/A" }
    const sum = ratings.reduce(
      (acc, rating) => ({
        content: acc.content + rating.content_rating,
        aesthetic: acc.aesthetic + rating.aesthetic_rating,
      }),
      { content: 0, aesthetic: 0 },
    )
    return {
      content: (sum.content / ratings.length).toFixed(1),
      aesthetic: (sum.aesthetic / ratings.length).toFixed(1),
    }
  }

  async function handleDelete(id: number) {
    try {
      const result = await deleteImage(id)
      if (result.success) {
        setImages(images.filter((image) => image.id !== id))
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      setError("Failed to delete image. Please try again.")
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => {
        const avgRatings = calculateAverageRatings(image.ratings)
        return (
          <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm">
            <img src={image.url || "/placeholder.svg"} alt={`Image ${image.id}`} className="w-full h-40 object-cover" />
            <div className="p-2 bg-gray-100">
              <p className="text-sm font-semibold">ID: {image.id}</p>
              <p className="text-sm">Content Rating: {avgRatings.content}</p>
              <p className="text-sm">Aesthetic Rating: {avgRatings.aesthetic}</p>
              <p className="text-xs text-gray-600">Total Ratings: {image.ratings.length}</p>
              <button
                onClick={() => handleDelete(image.id)}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

