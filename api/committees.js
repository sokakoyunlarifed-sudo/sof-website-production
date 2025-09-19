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
        .from('committees')
        .select('id,name,role,image')
        .order('name', { ascending: true })
      if (error) return res.status(400).json({ error: error.message })
      return res.json(data)
    }

    if (req.method === 'POST') {
      const rows = Array.isArray(req.body) ? req.body : [req.body]
      const { error } = await supabase.from('committees').insert(rows)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    if (req.method === 'PATCH') {
      const { id, ...patch } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id is required' })
      const { error } = await supabase.from('committees').update(patch).eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id is required' })
      const { error } = await supabase.from('committees').delete().eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Internal error' })
  }
} 