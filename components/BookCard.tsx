'use client'

interface Book {
  id: string
  title: string
  author: string
  status: 'reading' | 'finished' | 'want-to-read'
  cover_url?: string
  created_at: string
}

interface BookCardProps {
  book: Book
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, newStatus: string) => void
}

export default function BookCard({ book, onDelete, onStatusChange }: BookCardProps) {
  const statusColors = {
    reading: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
    'want-to-read': 'bg-yellow-100 text-yellow-800',
  }

  const statusLabels = {
    reading: 'Currently Reading',
    finished: 'Finished',
    'want-to-read': 'Want to Read',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        {/* Book Cover Placeholder */}
        <div className="flex-shrink-0">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-16 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📚</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-600 truncate">by {book.author}</p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[book.status]
              }`}
            >
              {statusLabels[book.status]}
            </span>
          </div>

          {/* Actions */}
          {(onDelete || onStatusChange) && (
            <div className="mt-3 flex gap-2">
              {onStatusChange && (
                <select
                  value={book.status}
                  onChange={(e) => onStatusChange(book.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="reading">Reading</option>
                  <option value="finished">Finished</option>
                  <option value="want-to-read">Want to Read</option>
                </select>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(book.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
