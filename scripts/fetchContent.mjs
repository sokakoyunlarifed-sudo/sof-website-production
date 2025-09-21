import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function loadEnvFromDotenv() {
  try {
    const envPath = resolve(__dirname, '../.env')
    const text = await readFile(envPath, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const key = m[1]
      let val = m[2]
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      if (!(key in process.env)) process.env[key] = val
    }
  } catch (_) {
    // ignore if .env not found
  }
}

await loadEnvFromDotenv()

let url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
let anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Supabase ortam değişkenleri bulunamadı (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY).')
  process.exit(1)
}

const supabase = createClient(url, anonKey)

const outDir = resolve(__dirname, '../src/data')

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

function toNewsRow(n) {
  return {
    id: n.id,
    title: n.title,
    date: n.date || '',
    shortText: n.short_text || '',
    fullText: n.full_text || '',
    image: n.image || ''
  }
}

function toAnnouncementRow(d) {
  return {
    id: d.id,
    title: d.title,
    date: d.date || '',
    location: d.location || '',
    description: d.description || '',
    image: d.image || ''
  }
}

function jsLiteral(obj) {
  return JSON.stringify(obj, null, 2)
}

async function main() {
  console.log('İçerik çekiliyor...')
  await ensureDir(outDir)

  const { data: news, error: newsErr } = await supabase
    .from('news')
    .select('id,title,date,short_text,full_text,image')
    .order('date', { ascending: false })
  if (newsErr) throw newsErr
  const newsArr = (news || []).map(toNewsRow)

  const { data: ann, error: annErr } = await supabase
    .from('announcements')
    .select('id,title,date,location,description,image')
    .order('date', { ascending: false })
  if (annErr) throw annErr
  const annArr = (ann || []).map(toAnnouncementRow)

  const { data: com, error: comErr } = await supabase
    .from('committees')
    .select('id,name,role,image')
    .order('name', { ascending: true })
  if (comErr) throw comErr
  const comArr = com || []

  const moduleCode = `// Auto-generated at build time. Do not edit.
export const STATIC_NEWS = ${jsLiteral(newsArr)};
export const STATIC_ANNOUNCEMENTS = ${jsLiteral(annArr)};
export const STATIC_COMMITTEES = ${jsLiteral(comArr)};
`

  await writeFile(resolve(outDir, 'staticData.js'), moduleCode, 'utf8')
  console.log('İçerik gömülü modül üretildi: src/data/staticData.js')
}

main().catch((e) => {
  console.error('İçerik çekme hatası:', e?.message || e)
  process.exit(1)
}) 