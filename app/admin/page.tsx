import ImageUpload from "../../components/ImageUpload"
import ImageThumbnailList from "../../components/ImageThumbnailList"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin - Image Management</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upload New Image</h2>
        <ImageUpload />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Images</h2>
        <ImageThumbnailList />
      </div>
    </div>
  )
}

