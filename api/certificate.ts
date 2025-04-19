// pages/api/certificate.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// URL CSV hasil "Publish to web" Google Sheets
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ_JgGIZA2_DTZZJ7Hk5YRQIfEwOAllszcYiiZmE3o4XmnCIvgQuH6nsUt98LevnoPaPY8wHBD_yyL/pub?gid=907933854&single=true&output=csv'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const emailParam = req.query.email
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  const emailLower = email.trim().toLowerCase()

  try {
    // 1. Fetch CSV & parse
    const csvRes = await fetch(CSV_URL)
    if (!csvRes.ok) throw new Error('Failed to fetch participant data')
    const csvText = await csvRes.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

    const emailIdx = headers.findIndex(h => h.includes('email'))
    const fileIdx  = headers.findIndex(h => h.includes('file'))
    if (emailIdx < 0) throw new Error('CSV missing "Email" column')
    if (fileIdx  < 0) throw new Error('CSV missing "File" column')

    let fileName: string | undefined
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',')
      if (cols[emailIdx].trim().toLowerCase() === emailLower) {
        fileName = cols[fileIdx].trim()
        break
      }
    }
    if (!fileName) {
      return res.status(404).json({ error: 'Email not found' })
    }

    // 2. Generate signed URL & fetch PDF
    const { data: signedData, error: signedErr } =
      await supabase.storage.from('certificates').createSignedUrl(fileName, 60)
    if (signedErr || !signedData?.signedUrl) {
      return res.status(404).json({ error: 'Certificate not found in storage' })
    }
    const fileRes = await fetch(signedData.signedUrl)
    if (!fileRes.ok) throw new Error('Failed to download certificate')

    // 3. Send PDF
    const arrayBuffer = await fileRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    )
    res.send(buffer)

  } catch (err: any) {
    console.error('[/api/certificate] error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
