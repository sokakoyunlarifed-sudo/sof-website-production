import { Client } from 'pg'
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

const connectionString = 'postgres://homserver:P0stGre5_h0m3s3rv3r_2025!@127.0.0.1:5432/homesofdb'
const client = new Client({ connectionString })

const outDir = resolve(__dirname, '../src/data')

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

function toNewsRow(n) {
  return {
    id: n.id,
    title: n.title,
    date: n.date ? new Date(n.date).toISOString() : '',
    shortText: n.short_text || '',
    fullText: n.full_text || '',
    image: n.image || '',
    video_url: n.video_url || null,
    images: n.images || []
  }
}

function toAnnouncementRow(d) {
  return {
    id: d.id,
    title: d.title,
    date: d.date ? new Date(d.date).toISOString() : '',
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

  let newsArr = [];
  let annArr = [];
  let comArr = [];

  try {
    await client.connect()

    const { rows: news } = await client.query(`
      SELECT n.id, n.title, n.date, n.short_text, n.full_text, n.image, n.video_url,
      (SELECT json_agg(ni.image_url) FROM news_images ni WHERE ni.news_id = n.id) as images
      FROM public.news n ORDER BY n.date DESC
    `)
    newsArr = news.map(toNewsRow)

    const { rows: ann } = await client.query(`
      SELECT id, title, date, location, description, image FROM public.announcements ORDER BY date DESC
    `)
    annArr = ann.map(toAnnouncementRow)

    const { rows: com } = await client.query(`
      SELECT id, name, role, image FROM public.committees ORDER BY name ASC
    `)
    comArr = com
  } catch (err) {
    console.error("Warning: DB Connection failed. Returning empty data. Error:", err.message);
  } finally {
    try { await client.end() } catch (e) { }
  }

  const moduleCode = `// Auto-generated at build time. Do not edit.\nexport const STATIC_NEWS = ${jsLiteral(newsArr)};\nexport const STATIC_ANNOUNCEMENTS = ${jsLiteral(annArr)};\nexport const STATIC_COMMITTEES = ${jsLiteral(comArr)};\n`

  await writeFile(resolve(outDir, 'staticData.js'), moduleCode, 'utf8')
  console.log('İçerik gömülü modül üretildi: src/data/staticData.js')
}

main().catch((e) => {
  console.error('İçerik çekme hatası:', e?.message || e)
  process.exit(1)
}).finally(() => client.end())