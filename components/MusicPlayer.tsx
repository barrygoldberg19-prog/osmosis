'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SpotifyTrack {
  item?: {
    name: string
    artists: { name: string }[]
    album: {
      name: string
      images: { url: string }[]
    }
  }
  track?: {
    name: string
    artists: { name: string }[]
    album: {
      name: string
      images: { url: string }[]
    }
  }
}

export default function MusicPlayer() {
  const [musicData, setMusicData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [spotifyConnected, setSpotifyConnected] = useState(false)

  const fetchMusicData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/spotify')
      if (res.ok) {
        const data = await res.json()
        setMusicData(data)
        setSpotifyConnected(true)
      } else if (res.status === 404) {
        setSpotifyConnected(false)
      }
    } catch (error) {
      console.error('Error fetching music:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMusicData()
  }, [])

  const connectSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = window.location.origin + '/api/spotify-callback'
    const scopes = 'user-read-currently-playing user-read-recently-played'

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`

    window.location.href = authUrl
  }

  if (!spotifyConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🎵 Listening To</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Connect your Spotify to share what you're listening to</p>
          <button
            onClick={connectSpotify}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🎵 Listening To</h3>
        <div className="text-center py-8 text-gray-500">Loading your music...</div>
      </div>
    )
  }

  const renderTrack = (track: SpotifyTrack, isPlaying: boolean = false) => {
    const trackData = track.item || track.track
    if (!trackData) return null

    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        {trackData.album.images[0] && (
          <Image
            src={trackData.album.images[0].url}
            alt={trackData.album.name}
            width={64}
            height={64}
            className="rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 truncate">{trackData.name}</p>
            {isPlaying && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-green-600 text-sm">
                <span className="animate-pulse">▶</span> Playing
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {trackData.artists.map((a: any) => a.name).join(', ')}
          </p>
          <p className="text-xs text-gray-500 truncate">{trackData.album.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">🎵 Listening To</h3>
        <button
          onClick={fetchMusicData}
          disabled={loading}
          className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {musicData?.currently_playing ? (
        renderTrack(musicData.currently_playing, true)
      ) : musicData?.recently_played && musicData.recently_played.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-2">Recently played:</p>
          {musicData.recently_played.slice(0, 3).map((item: any, idx: number) => (
            <div key={idx}>{renderTrack(item)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No music activity found. Start listening on Spotify!
        </div>
      )}
    </div>
  )
}
