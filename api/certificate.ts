// /api/certificate.ts

import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fetch from 'node-fetch'

const SHEET_ID = '11n-IpRPNdS8sRt6FtzoewcTlOEfpT3N9xfdCAQp6qBU'
const RANGE = 'Form Responses 1!A:D' // Sesuaikan kalau kamu ubah sheet

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string
  if (!email) return res.status(400).send('Email is required.')

  // Load credentials
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS as string)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  })

  const rows = response.data.values
  if (!rows) return res.status(500).send('No data found in sheet.')

  const headers = rows[0]
  const data = rows.slice(1)
  const emailIndex = headers.findIndex((h) => h.toLowerCase().includes('email'))
  const nameIndex = headers.findIndex((h) => h.toLowerCase().includes('nama'))

  const match = data.find((row) => row[emailIndex]?.trim().toLowerCase() === email.trim().toLowerCase())
  if (!match) return res.status(404).send('Email not found.')

  const name = match[nameIndex]

  // Fetch background image
  const imageUrl = process.env.CERTIFICATE_IMAGE_URL as string
  const imageBytes = await fetch(imageUrl).then((r) => r.arrayBuffer())

  // Create PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 landscape
  const pngImage = await pdfDoc.embedPng(imageBytes)
  page.drawImage(pngImage, { x: 0, y: 0, width: 842, height: 595 })

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const textWidth = font.widthOfTextAtSize(name, 28)
  page.drawText(name, {
    x: (842 - textWidth) / 2,
    y: 280,
    size: 28,
    font,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="sertifikat-${name}.pdf"`)
  res.send(Buffer.from(pdfBytes))
}
