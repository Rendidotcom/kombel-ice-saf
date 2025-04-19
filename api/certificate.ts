// /api/certificate.ts

import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fetch from 'node-fetch'

// Optional: pastikan dijalankan di Node, bukan Edge
export const config = { runtime: 'nodejs' }

const SHEET_ID = process.env.SHEET_ID || '11n-IpRPNdS8sRt6FtzoewcTlOEfpT3N9xfdCAQp6qBU'
const RANGE = process.env.SHEET_RANGE || 'Form Responses 1!A:D'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const emailParam = req.query.email
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam
  if (!email) {
    return res.status(400).json({ error: 'Missing email parameter' })
  }

  try {
    // Load dan parse credentials dari ENV
    const creds = process.env.GOOGLE_CREDENTIALS
    if (!creds) throw new Error('GOOGLE_CREDENTIALS not set')
    const credentials = JSON.parse(creds)

    // Auth ke Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const sheets = google.sheets({ version: 'v4', auth })

    // Baca data dari sheet
    const sheetRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    })
    const rows = sheetRes.data.values
    if (!rows || rows.length < 2) {
      return res.status(404).json({ error: 'No data found in sheet' })
    }

    // Temukan index kolom Email & Nama dari header
    const [headers, ...dataRows] = rows
    const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'))
    const nameIndex  = headers.findIndex(h => h.toLowerCase().includes('nama'))
    if (emailIndex < 0 || nameIndex < 0) {
      throw new Error('Invalid sheet headers')
    }

    // Cari baris yang cocok email-nya
    const record = dataRows.find(r => 
      r[emailIndex]?.trim().toLowerCase() === email.trim().toLowerCase()
    )
    if (!record) {
      return res.status(404).json({ error: 'Email not found' })
    }
    const name = record[nameIndex] || ''

    // Fetch gambar sertifikat dari Supabase Storage (publik)
    const imageUrl = process.env.CERTIFICATE_IMAGE_URL
    if (!imageUrl) throw new Error('CERTIFICATE_IMAGE_URL not set')
    const imageResp = await fetch(imageUrl)
    if (!imageResp.ok) throw new Error('Failed to fetch certificate template')
    const imageBytes = await imageResp.arrayBuffer()

    // Buat PDF & sisipkan gambar + teks nama
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595])  // A4 landscape
    const png   = await pdfDoc.embedPng(imageBytes)
    page.drawImage(png, { x: 0, y: 0, width: 842, height: 595 })

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontSize = 28
    const textWidth = font.widthOfTextAtSize(name, fontSize)
    page.drawText(name, {
      x: (842 - textWidth) / 2,
      y: 280,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()

    // Kirim PDF sebagai attachment
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sertifikat-${name.replace(/\s+/g,'_')}.pdf"`
    )
    res.send(Buffer.from(pdfBytes))

  } catch (err: any) {
    console.error('[/api/certificate] error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
