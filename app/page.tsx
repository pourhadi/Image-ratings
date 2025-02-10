import ImageRating from "../components/ImageRating"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Rating</h1>
      <ImageRating />
    </div>
  )
}

