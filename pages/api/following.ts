import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get user's Twitter access token from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('twitter_id, twitter_access_token')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Fetch following list from X API v2
    const response = await fetch(
      `https://api.twitter.com/2/users/${userData.twitter_id}/following?max_results=100&user.fields=profile_image_url,description`,
      {
        headers: {
          Authorization: `Bearer ${userData.twitter_access_token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch following list')
    }

    const data = await response.json()

    // Save following list to Supabase
    const { error: saveError } = await supabase
      .from('user_following')
      .upsert({
        user_id: session.user.id,
        following_data: data.data,
        updated_at: new Date().toISOString(),
      })

    if (saveError) console.error('Error saving following list:', saveError)

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching following:', error)
    res.status(500).json({ error: 'Failed to fetch following list' })
  }
}
