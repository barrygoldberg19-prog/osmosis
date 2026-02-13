import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = session.user?.id

  // GET - Fetch all books for the user
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
      return res.status(500).json({ error: 'Failed to fetch books' })
    }
  }

  // POST - Add a new book
  if (req.method === 'POST') {
    try {
      const { title, author, status } = req.body

      if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' })
      }

      const { data, error } = await supabase
        .from('books')
        .insert({
          user_id: userId,
          title,
          author,
          status: status || 'reading',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json(data)
    } catch (error) {
      console.error('Error adding book:', error)
      return res.status(500).json({ error: 'Failed to add book' })
    }
  }

  // PATCH - Update book status
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query
      const { status } = req.body

      if (!id || !status) {
        return res.status(400).json({ error: 'ID and status are required' })
      }

      const { data, error } = await supabase
        .from('books')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error updating book:', error)
      return res.status(500).json({ error: 'Failed to update book' })
    }
  }

  // DELETE - Remove a book
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }

      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting book:', error)
      return res.status(500).json({ error: 'Failed to delete book' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
