interface RatingInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export default function RatingInput({ label, value, onChange }: RatingInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex space-x-2">
        {[0, 1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`w-10 h-10 rounded-full ${value === rating ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  )
}

