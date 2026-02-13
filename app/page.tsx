'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const { data: session, status } = useSession()
  const [following, setFollowing] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchFollowing()
    }
  }, [session])

  const fetchFollowing = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/following')
      const data = await res.json()
      setFollowing(data.data || [])
    } catch (error) {
      console.error('Error fetching following:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-6xl font-bold text-gray-900">Up2</h1>
          <p className="text-2xl text-gray-700">
            Share what you're reading, listening to, and watching
          </p>
          <button
            onClick={() => signIn('twitter')}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Sign in with X
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Up2</h1>
          <div className="flex items-center gap-4">
            <Image
              src={session.user?.image || ''}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-gray-700">{session.user?.name}</span>
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
        {/* Following Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Who You're Following on X</h2>
            <button
              onClick={fetchFollowing}
              disabled={loading}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading && following.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading your following list...</div>
          ) : following.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.slice(0, 12).map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Image
                    src={user.profile_image_url}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500 truncate">@{user.username}</div>
                    {user.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {user.description}
                      </p>
                    )}
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

        {/* Placeholder for future features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Currently Reading</h3>
            <p className="text-gray-500">Coming soon! You'll be able to add books here.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎵 Listening To</h3>
            <p className="text-gray-500">Coming soon! Connect your Spotify.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎧 Podcasts</h3>
            <p className="text-gray-500">Coming soon! Add your favorite podcasts.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📺 YouTube</h3>
            <p className="text-gray-500">Coming soon! Share what you're watching.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
