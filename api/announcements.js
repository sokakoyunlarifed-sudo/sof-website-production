import { getAdminSupabase } from './_utils/supabaseClient.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = getAdminSupabase()

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('announcements')
        .select('id,title,date,location,description,image')
        .order('date', { ascending: false })
      if (error) return res.status(400).json({ error: error.message })
      return res.json(data)
    }

    if (req.method === 'POST') {
      const rows = Array.isArray(req.body) ? req.body : [req.body]
      const { error } = await supabase.from('announcements').insert(rows)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    if (req.method === 'PATCH') {
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id is required' })
      const { error } = await supabase.from('announcements').update(patch).eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id is required' })
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Internal error' })
  }
} 