import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const asyncHandler = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e)
  const msg = e?.message || 'Internal error'
  res.status(500).json({ error: msg })
})

app.get('/api/news', asyncHandler(async (_req, res) => {
  const { data, error } = await supabase.from('news').select('id,title,date,short_text,full_text,image').order('date', { ascending: false })
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}))

app.post('/api/news', asyncHandler(async (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [req.body]
  const { error } = await supabase.from('news').insert(rows)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.patch('/api/news/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('news').update(req.body).eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.delete('/api/news/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.get('/api/announcements', asyncHandler(async (_req, res) => {
  const { data, error } = await supabase.from('announcements').select('id,title,date,location,description,image').order('date', { ascending: false })
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}))

app.post('/api/announcements', asyncHandler(async (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [req.body]
  const { error } = await supabase.from('announcements').insert(rows)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.patch('/api/announcements/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('announcements').update(req.body).eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.delete('/api/announcements/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.get('/api/committees', asyncHandler(async (_req, res) => {
  const { data, error } = await supabase.from('committees').select('id,name,role,image').order('name', { ascending: true })
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}))

app.post('/api/committees', asyncHandler(async (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [req.body]
  const { error } = await supabase.from('committees').insert(rows)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.patch('/api/committees/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('committees').update(req.body).eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

app.delete('/api/committees/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('committees').delete().eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.status(204).end()
}))

const port = process.env.PORT || 8787
app.listen(port, () => console.log(`API running on http://localhost:${port}`)) 