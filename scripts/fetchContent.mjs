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

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials missing.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const outDir = resolve(__dirname, '../src/data')

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

function jsLiteral(obj) {
  return JSON.stringify(obj, null, 2)
}

async function main() {
  console.log('İçerik Supabase\'den çekiliyor...')
  await ensureDir(outDir)

  const { data: newsArr, error: newsErr } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false })

  if (newsErr) console.error('News error:', newsErr.message)

  const { data: annArr, error: annErr } = await supabase
    .from('announcements')
    .select('*')
    .order('date', { ascending: false })

  if (annErr) console.error('Announcements error:', annErr.message)

  const { data: comArr, error: comErr } = await supabase
    .from('committees')
    .select('*')
    .order('name', { ascending: true })

  if (comErr) console.error('Committees error:', comErr.message)

  const mapItem = (item) => {
    if (!item) return item;
    const newItem = { ...item };
    // Map snake_case to camelCase for frontend
    if (item.short_text !== undefined) newItem.shortText = item.short_text;
    if (item.full_text !== undefined) newItem.fullText = item.full_text;

    // Fix image URLs (Supabase or MinIO relative)
    const fixUrl = (url) => {
      if (!url) return url;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;

      if (url.startsWith('/storage/v1/object/public/')) {
        return `${supabaseUrl}${url}`;
      }

      // If it's a relative path and doesn't look like a standard path, 
      // it might be a MinIO key. We assume public endpoint.
      const minioEndpoint = 'https://s3.sof.web.tr/sof-media';
      return `${minioEndpoint}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    if (newItem.image) newItem.image = fixUrl(newItem.image);
    if (newItem.image_url) newItem.image_url = fixUrl(newItem.image_url);
    if (Array.isArray(newItem.images)) {
      newItem.images = newItem.images.map(fixUrl);
    }
    return newItem;
  };

  const finalNews = (newsArr || []).map(mapItem);
  const finalAnnouncements = (annArr || []).map(mapItem);
  const finalCommittees = (comArr || []).map(mapItem);

  const moduleCode = `// Auto-generated at build time via Supabase. Do not edit.\nexport const STATIC_NEWS = ${jsLiteral(finalNews)};\nexport const STATIC_ANNOUNCEMENTS = ${jsLiteral(finalAnnouncements)};\nexport const STATIC_COMMITTEES = ${jsLiteral(finalCommittees)};\n`

  await writeFile(resolve(outDir, 'staticData.js'), moduleCode, 'utf8')
  console.log('İçerik gömülü modül üretildi: src/data/staticData.js')
}

main().catch((e) => {
  console.error('İçerik çekme hatası:', e?.message || e)
  process.exit(1)
})