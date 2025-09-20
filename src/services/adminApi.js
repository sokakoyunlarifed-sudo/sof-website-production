import { supabase } from '../lib/supabaseClient'

// Basic guard to ensure Supabase client is configured
const ensureClient = () => {
  if (!supabase) throw new Error('Supabase client is not configured')
}

const withTimeout = async (promise, ms = 20000) => {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Operation timed out')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

// Fetch current user's role from profiles table
const getCurrentUserRole = async () => {
  ensureClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  if (error) return null
  return data?.role || null
}

// Ensure the current user is an admin before allowing writes
const ensureAdmin = async () => {
  const role = await getCurrentUserRole()
  if (role !== 'admin') throw new Error('Only admin users can perform this action')
}

// ------- MEDIA UPLOAD -------
export const uploadMedia = async (file, folder = 'misc') => {
  ensureClient()
  if (!(file instanceof File)) throw new Error('Invalid file')
  const safeFolder = (folder || 'misc').replace(/[^a-z0-9/_-]/gi, '').toLowerCase()
  const ext = (file.name?.split('.')?.pop() || 'bin').toLowerCase()
  const unique = `${Date.now()}-${(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))}`
  const path = `${safeFolder}/${unique}.${ext}`

  const { error: uploadError } = await withTimeout(
    supabase.storage
      .from('mediaa')
      .upload(path, file, { upsert: true, contentType: file.type || undefined })
  )
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('mediaa').getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Public URL not available')
  return data.publicUrl
}

// ------- NEWS (haberler) -------
export const fetchNews = async () => {
  ensureClient()
  const { data, error } = await supabase
    .from('news')
    .select('id,title,date,short_text,full_text,image')
    .order('date', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []).map((n) => ({
    id: n.id,
    title: n.title,
    date: n.date || '',
    shortText: n.short_text || '',
    fullText: n.full_text || '',
    image: n.image || '',
  }))
}

export const createNews = async (payload) => {
  ensureClient()
  await ensureAdmin()
  const row = {
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('news').insert(row))
  if (error) throw new Error(error.message)
  return null
}

export const updateNews = async (id, payload) => {
  ensureClient()
  await ensureAdmin()
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('news').update(patch).eq('id', id))
  if (error) throw new Error(error.message)
  return null
}

export const deleteNews = async (id) => {
  ensureClient()
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('news').delete().eq('id', id))
  if (error) throw new Error(error.message)
}

// ------- ANNOUNCEMENTS (duyurular) -------
export const fetchAnnouncements = async () => {
  ensureClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('id,title,date,location,description,image')
    .order('date', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []).map((d) => ({
    id: d.id,
    title: d.title,
    date: d.date || '',
    location: d.location || '',
    description: d.description || '',
    image: d.image || '',
  }))
}

export const createAnnouncement = async (payload) => {
  ensureClient()
  await ensureAdmin()
  const row = {
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('announcements').insert(row))
  if (error) throw new Error(error.message)
  return null
}

export const updateAnnouncement = async (id, payload) => {
  ensureClient()
  await ensureAdmin()
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('announcements').update(patch).eq('id', id))
  if (error) throw new Error(error.message)
  return null
}

export const deleteAnnouncement = async (id) => {
  ensureClient()
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('announcements').delete().eq('id', id))
  if (error) throw new Error(error.message)
}

// ------- COMMITTEES (kurullar) -------
export const fetchCommittees = async () => {
  ensureClient()
  const { data, error } = await supabase
    .from('committees')
    .select('id,name,role,image')
    .order('name', { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

export const createCommittee = async (payload) => {
  ensureClient()
  await ensureAdmin()
  const row = {
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('committees').insert(row))
  if (error) throw new Error(error.message)
  return null
}

export const updateCommittee = async (id, payload) => {
  ensureClient()
  await ensureAdmin()
  const patch = {
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('committees').update(patch).eq('id', id))
  if (error) throw new Error(error.message)
  return null
}

export const deleteCommittee = async (id) => {
  ensureClient()
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('committees').delete().eq('id', id))
  if (error) throw new Error(error.message)
} 