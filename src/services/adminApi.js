import { supabase } from '../lib/supabaseClient'
import imageCompression from 'browser-image-compression'

// Basic guard to ensure Supabase client is configured
const ensureClient = () => {
  if (!supabase) throw new Error('Supabase istemcisi yapılandırılmadı')
}

const withTimeout = async (promise, ms = 20000) => {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('İşlem zaman aşımına uğradı')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

const formatError = (error) => {
  if (!error) return 'Bilinmeyen hata'
  const parts = [error.message, error.details, error.hint, error.code].filter(Boolean)
  return parts.join(' | ')
}

const ensureFreshAuth = async () => {
  ensureClient()
  const { data: sess } = await withTimeout(supabase.auth.getSession())
  const session = sess?.session
  if (!session) throw new Error('Kimlik doğrulaması yok')
  try {
    await withTimeout(supabase.auth.refreshSession())
  } catch (_e) {
    // Best-effort; proceed even if refresh fails, next call will surface the error
  }
}

// Fetch current user's role from profiles table
const getCurrentUserRole = async () => {
  await ensureFreshAuth()
  const { data: sessionData } = await withTimeout(supabase.auth.getSession())
  const userId = sessionData?.session?.user?.id
  if (!userId) return null
  const { data, error } = await withTimeout(
    supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
  )
  if (error) return null
  return data?.role || null
}

// Ensure the current user is an admin before allowing writes
const ensureAdmin = async () => {
  const role = await getCurrentUserRole()
  if (role !== 'admin') throw new Error('Bu işlem sadece yönetici kullanıcılar tarafından yapılabilir')
}

// ------- MEDIA UPLOAD -------
export const uploadMedia = async (file, folder = 'misc') => {
  await ensureFreshAuth()
  if (!(file instanceof File)) throw new Error('Geçersiz dosya')

  // Client-side image compression options
  const options = {
    maxSizeMB: 0.2, // Compress to ~200KB max
    maxWidthOrHeight: 1280, // Sane dimensions max width/height
    useWebWorker: true,
    fileType: 'image/webp', // WebP conversion for maximum efficiency
  }

  let compressedFile = file
  try {
    const compressedBlob = await imageCompression(file, options)
    const timestamp = Date.now()
    const originalName = file.name || 'image.png'
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
    const cleanBaseName = baseName.replace(/[^a-z0-9/_-]/gi, '').toLowerCase()
    const fileName = `${timestamp}_${cleanBaseName}.webp`
    compressedFile = new File([compressedBlob], fileName, { type: 'image/webp' })
  } catch (err) {
    console.warn('Görsel sıkıştırma başarısız oldu, orijinal görsel yüklenecek:', err)
  }

  const safeFolder = (folder || 'misc').replace(/[^a-z0-9/_-]/gi, '').toLowerCase()
  const path = `${safeFolder}/${compressedFile.name}`

  const { error: uploadError } = await withTimeout(
    supabase.storage
      .from('mediaa')
      .upload(path, compressedFile, { upsert: true, cacheControl: '31536000', contentType: 'image/webp' })
  )
  if (uploadError) throw new Error(formatError(uploadError))

  const { data } = supabase.storage.from('mediaa').getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Genel URL mevcut değil')
  return data.publicUrl
}

// ------- NEWS (haberler) -------
export const fetchNews = async () => {
  ensureClient()
  const { data, error } = await withTimeout(
    supabase
      .from('news')
      .select('id,title,date,short_text,full_text,image')
      .order('date', { ascending: false })
  )
  if (error) throw new Error(formatError(error))
  return (data || []).map((n) => ({
    id: n.id,
    title: n.title,
    date: n.date || '',
    shortText: n.short_text || '',
    fullText: n.full_text || '',
    image: n.image || '',
  }))
}

export const fetchNewsById = async (id) => {
  ensureClient()
  const { data, error } = await withTimeout(
    supabase
      .from('news')
      .select('id,title,date,short_text,full_text,image')
      .eq('id', id)
      .single()
  )
  if (error) throw new Error(formatError(error))
  return {
    id: data.id,
    title: data.title,
    date: data.date || '',
    shortText: data.short_text || '',
    fullText: data.full_text || '',
    image: data.image || '',
  }
}

export const createNews = async (payload) => {
  await ensureAdmin()
  const row = {
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('news').insert(row))
  if (error) {
    console.error('Haber oluşturma hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const updateNews = async (id, payload) => {
  await ensureAdmin()
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    short_text: payload.shortText || '',
    full_text: payload.fullText || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('news').update(patch).eq('id', id))
  if (error) {
    console.error('Haber güncelleme hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const deleteNews = async (id) => {
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('news').delete().eq('id', id))
  if (error) {
    console.error('Haber silme hatası:', error)
    throw new Error(formatError(error))
  }
}

// ------- ANNOUNCEMENTS (duyurular) -------
export const fetchAnnouncements = async () => {
  ensureClient()
  const { data, error } = await withTimeout(
    supabase
      .from('announcements')
      .select('id,title,date,location,description,image')
      .order('date', { ascending: false })
  )
  if (error) throw new Error(formatError(error))
  return (data || []).map((d) => ({
    id: d.id,
    title: d.title,
    date: d.date || '',
    location: d.location || '',
    description: d.description || '',
    image: d.image || '',
  }))
}

export const fetchAnnouncementById = async (id) => {
  ensureClient()
  const { data, error } = await withTimeout(
    supabase
      .from('announcements')
      .select('id,title,date,location,description,image')
      .eq('id', id)
      .single()
  )
  if (error) throw new Error(formatError(error))
  return {
    id: data.id,
    title: data.title,
    date: data.date || '',
    location: data.location || '',
    description: data.description || '',
    image: data.image || '',
  }
}

export const createAnnouncement = async (payload) => {
  await ensureAdmin()
  const row = {
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('announcements').insert(row))
  if (error) {
    console.error('Duyuru oluşturma hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const updateAnnouncement = async (id, payload) => {
  await ensureAdmin()
  const patch = {
    title: payload.title || '',
    date: payload.date || null,
    location: payload.location || '',
    description: payload.description || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('announcements').update(patch).eq('id', id))
  if (error) {
    console.error('Duyuru güncelleme hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const deleteAnnouncement = async (id) => {
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('announcements').delete().eq('id', id))
  if (error) {
    console.error('Duyuru silme hatası:', error)
    throw new Error(formatError(error))
  }
}

// ------- COMMITTEES (kurullar) -------
export const fetchCommittees = async () => {
  ensureClient()
  const { data, error } = await withTimeout(
    supabase
      .from('committees')
      .select('id,name,role,image')
      .order('name', { ascending: true })
  )
  if (error) throw new Error(formatError(error))
  return data || []
}

export const createCommittee = async (payload) => {
  await ensureAdmin()
  const row = {
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('committees').insert(row))
  if (error) {
    console.error('Kurul oluşturma hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const updateCommittee = async (id, payload) => {
  await ensureAdmin()
  const patch = {
    name: payload.name || '',
    role: payload.role || '',
    image: payload.image || '',
  }
  const { error } = await withTimeout(supabase.from('committees').update(patch).eq('id', id))
  if (error) {
    console.error('Kurul güncelleme hatası:', error)
    throw new Error(formatError(error))
  }
  return null
}

export const deleteCommittee = async (id) => {
  await ensureAdmin()
  const { error } = await withTimeout(supabase.from('committees').delete().eq('id', id))
  if (error) {
    console.error('Kurul silme hatası:', error)
    throw new Error(formatError(error))
  }
} 