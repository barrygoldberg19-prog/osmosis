'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import BookCard from '../components/BookCard'
import AddBookModal from '../components/AddBookModal'
import MusicPlayer from '../components/MusicPlayer'

export default function Home() {
  const { data: session, status } = useSession()
  const [following, setFollowing] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [showAddBook, setShowAddBook] = useState(false)

  useEffect(() => {
    if (session) {
      fetchFollowing()
      fetchBooks()
    }
  }, [session])

  const fetchFollowing = async () => {
    setLoadingFollowing(true)
    try {
      const res = await fetch('/api/following')
      const data = await res.json()
      setFollowing(data.data || [])
    } catch (error) {
      console.error('Error fetching following:', error)
    } finally {
      setLoadingFollowing(false)
    }
  }

  const fetchBooks = async () => {
    setLoadingBooks(true)
    try {
      const res = await fetch('/api/books')
      const data = await res.json()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }

  const handleAddBook = async (bookData: { title: string; author: string; status: string }) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      })

      if (res.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Remove this book?')) return

    try {
      const res = await fetch(`/api/books?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/books?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchBooks()
      }
    } catch (error) {
      console.error('Error updating book status:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-8 p-8">
          <h1 className="text-6xl font-bold text-gray-900">Osmosis</h1>
          <p className="text-2xl text-gray-700">
            Share what you're reading, listening to, and watching
          </p>
          <button
            onClick={() => signIn('twitter')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Sign in with X
          </button>
        </div>
      </div>
    )
  }

  const currentlyReading = books.filter((b) => b.status === 'reading')
  const finished = books.filter((b) => b.status === 'finished')
  const wantToRead = books.filter((b) => b.status === 'want-to-read')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Osmosis</h1>
          <div className="flex items-center gap-4">
            <Image
              src={session.user?.image || ''}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-gray-700 hidden sm:inline">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Books & Music */}
          <div className="lg:col-span-2 space-y-6">
            {/* Books Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">📚 Currently Reading</h2>
                <button
                  onClick={() => setShowAddBook(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  + Add Book
                </button>
              </div>

              {loadingBooks ? (
                <div className="text-center py-8 text-gray-500">Loading books...</div>
              ) : currentlyReading.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentlyReading.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onDelete={handleDeleteBook}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No books yet. Click "Add Book" to get started!
                </div>
              )}

              {/* Other Book Lists */}
              {finished.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Finished</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {finished.slice(0, 4).map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onDelete={handleDeleteBook}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {wantToRead.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📖 Want to Read</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wantToRead.slice(0, 4).map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onDelete={handleDeleteBook}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Music Section */}
            <MusicPlayer />
          </div>

          {/* Right Column - X Following */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Following on X</h2>
                <button
                  onClick={fetchFollowing}
                  disabled={loadingFollowing}
                  className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-3 rounded disabled:opacity-50"
                >
                  {loadingFollowing ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loadingFollowing && following.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : following.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {following.slice(0, 10).map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Image
                        src={user.profile_image_url}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Click refresh to load your following list
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Book Modal */}
      <AddBookModal isOpen={showAddBook} onClose={() => setShowAddBook(false)} onAdd={handleAddBook} />
    </div>
  )
}
