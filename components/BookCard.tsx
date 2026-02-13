interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    status: string
  }
  onDelete: (id: string) => void
  onStatusChange: (id: string, newStatus: string) => void
}

export default function BookCard({ book, onDelete, onStatusChange }: BookCardProps) {
  // Generate search URLs for the book
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`
  const zLibraryUrl = `https://z-lib.gs/s/${encodeURIComponent(book.title + ' ' + book.author)}`

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
        </div>
        <button
          onClick={() => onDelete(book.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
          title="Remove book"
        >
          ✕
        </button>
      </div>

      {/* Book Links */}
      <div className="flex gap-2 mb-3">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-full transition-colors"
        >
          🛒 Amazon
        </a>
        <a
          href={zLibraryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors"
        >
          📚 Z-Library
        </a>
      </div>

      {/* Status Selector */}
      <select
        value={book.status}
        onChange={(e) => onStatusChange(book.id, e.target.value)}
        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="reading">📖 Currently Reading</option>
        <option value="finished">✅ Finished</option>
        <option value="want-to-read">💭 Want to Read</option>
      </select>
    </div>
  )
}
