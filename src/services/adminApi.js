import { supabase } from '../lib/supabaseClient'

const ensureClient = () => {
  if (!supabase) throw new Error('Supabase client is not configured')
}

const withTimeout = async (promise, ms = 15000) => {
  let t
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error('İstek zaman aşımına uğradı')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(t)
  }
}

const baseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const proxyUrl = import.meta.env.VITE_SUPABASE_PROXY_URL || ''

const getAuthHeaders = async () => {
  ensureClient()
  const { data } = await supabase.auth.getSession()
  const accessToken = data?.session?.access_token
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken || anonKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Prefer: 'return=minimal',
  }
  return headers
}

const restGet = async (path, search) => {
  const headers = await getAuthHeaders()
  const url = proxyUrl
    ? `${proxyUrl}/api/${path}${search ? `?${search}` : ''}`
    : `${baseUrl}/rest/v1/${path}${search ? `?${search}` : ''}`
  const res = await withTimeout(fetch(url, { method: 'GET', headers, mode: 'cors', cache: 'no-store' }))
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `HTTP ${res.status}`)
  }
  return res.json()
}

const restInsert = async (table, rows) => {
  const headers = await getAuthHeaders()
  const url = proxyUrl
    ? `${proxyUrl}/api/${table}`
    : `${baseUrl}/rest/v1/${table}`
  const res = await withTimeout(fetch(url, { method: 'POST', headers, body: JSON.stringify(rows), mode: 'cors' }))
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `HTTP ${res.status}`)
  }
  return null
}

const restUpdateById = async (table, id, patch) => {
  const headers = await getAuthHeaders()
  const url = proxyUrl
    ? `${proxyUrl}/api/${table}/${encodeURIComponent(id)}`
    : `${baseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`
  const res = await withTimeout(fetch(url, { method: 'PATCH', headers, body: JSON.stringify(patch), mode: 'cors' }))
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `HTTP ${res.status}`)
  }
  return null
}

const restDeleteById = async (table, id) => {
  const headers = await getAuthHeaders()
  const url = proxyUrl
    ? `${proxyUrl}/api/${table}/${encodeURIComponent(id)}`
    : `${baseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`
  const res = await withTimeout(fetch(url, { method: 'DELETE', headers, mode: 'cors' }))
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `HTTP ${res.status}`)
  }
}

export const uploadMedia = async (file, folder = 'misc') => {
  ensureClient()
  if (!(file instanceof File)) throw new Error('Invalid file')
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '').toLowerCase() || 'misc'
  const ext = (file.name?.split('.')?.pop() || 'bin').toLowerCase()
  const unique = `${Date.now()}-${(typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`
  const path = `${safeFolder}/${unique}.${ext}`

  const { error: uploadError } = await withTimeout(
    supabase.storage.from('mediaa').upload(path, file, { upsert: true, contentType: file.type || undefined })
  )
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('mediaa').getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Public URL not available')
  return data.publicUrl
}

// NEWS (haberler)
export const fetchNews = async () => {
  const data = await restGet('news', 'select=id,title,date,short_text,full_text,image&order=date.desc')
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
  const insert = [{
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }]
  await restInsert('news', insert)
  return null
}

export const updateNews = async (id, payload) => {
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }
  await restUpdateById('news', id, patch)
  return null
}

export const deleteNews = async (id) => {
  await restDeleteById('news', id)
}

// ANNOUNCEMENTS (duyurular)
export const fetchAnnouncements = async () => {
  const data = await restGet('announcements', 'select=id,title,date,location,description,image&order=date.desc')
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
  const insert = [{
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }]
  await restInsert('announcements', insert)
  return null
}

export const updateAnnouncement = async (id, payload) => {
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }
  await restUpdateById('announcements', id, patch)
  return null
}

export const deleteAnnouncement = async (id) => {
  await restDeleteById('announcements', id)
}

// COMMITTEES (kurullar)
export const fetchCommittees = async () => {
  const data = await restGet('committees', 'select=id,name,role,image&order=name.asc')
  return data || []
}

export const createCommittee = async (payload) => {
  const insert = [{
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }]
  await restInsert('committees', insert)
  return null
}

export const updateCommittee = async (id, payload) => {
  const patch = {
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }
  await restUpdateById('committees', id, patch)
  return null
}

export const deleteCommittee = async (id) => {
  await restDeleteById('committees', id)
} 