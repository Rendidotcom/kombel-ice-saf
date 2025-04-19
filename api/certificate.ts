// api/certificate.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import csv from 'csv-parser';

// Supabase config
const supabase = createClient(
  'https://jmmqpqbpdmaelfnjhgly.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbXFwcWJwZG1hZWxmbmpoZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Njk1NzIsImV4cCI6MjA2MDQ0NTU3Mn0.853Yt-zBeLUZeosgS9Df5pYVEklqcprK-PS_1Zgtb4Q'
);

// Google Sheets CSV link
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ_JgGIZA2_DTZZJ7Hk5YRQIfEwOAllszcYiiZmE3o4XmnCIvgQuH6nsUt98LevnoPaPY8wHBD_yyL/pub?gid=907933854&single=true&output=csv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const email = (req.query.email as string)?.trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Email tidak valid' });
  }

  let match: { [key: string]: string } | null = null;

  try {
    await new Promise<void>((resolve, reject) => {
      https.get(CSV_URL, (response) => {
        response
          .pipe(csv())
          .on('data', (row) => {
            if (row['Email']?.trim().toLowerCase() === email) {
              match = row;
            }
          })
          .on('end', resolve)
          .on('error', reject);
      }).on('error', reject);
    });
  } catch (err) {
    console.error('Gagal membaca CSV:', err);
    return res.status(500).json({ error: 'Gagal membaca data peserta.' });
  }

  if (!match) {
    return res.status(404).json({ error: 'Email tidak ditemukan.' });
  }

  // Nama file sertifikat di Supabase (gunakan email sebagai nama file)
  const filePath = `${email}.pdf`; // pastikan file ini sudah diunggah ke bucket 'certificates'

  const { data, error } = await supabase.storage
    .from('certificates')
    .download(filePath);

  if (error || !data) {
    return res.status(404).json({ error: 'Sertifikat tidak ditemukan di Supabase.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filePath}"`);
  data.pipe(res);
}
