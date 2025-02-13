interface RatingInputProps {
    label: string
    value: number
    onChange: (value: number) => void
    disabled?: boolean // New optional 'disabled' prop
}

export default function RatingInput({ label, value, onChange, disabled = false }: RatingInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        onClick={() => !disabled && onChange(rating)} // Prevent clicks when disabled
                        className={`w-10 h-10 rounded-full ${
                            value === rating ? "bg-blue-500 text-white" : "bg-gray-200"
                        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`} // Styling for disabled state
                        disabled={disabled} // Set button's disabled attribute
                    >
                        {rating}
                    </button>
                ))}
            </div>
        </div>
    )
}