import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get user's Twitter access token from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('twitter_access_token, twitter_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData?.twitter_access_token) {
      console.error('Error fetching user data:', userError)
      return res.status(200).json({ data: [] })
    }

    // Fetch following list from Twitter API
    const response = await fetch(
      `https://api.twitter.com/2/users/${userData.twitter_id}/following?max_results=10&user.fields=profile_image_url`,
      {
        headers: {
          Authorization: `Bearer ${userData.twitter_access_token}`,
        },
      }
    )

    if (!response.ok) {
      console.error('Twitter API error:', response.status)
      return res.status(200).json({ data: [] })
    }

    const twitterData = await response.json()
    return res.status(200).json({ data: twitterData.data || [] })
  } catch (error) {
    console.error('Error fetching following:', error)
    return res.status(200).json({ data: [] })
  }
}
