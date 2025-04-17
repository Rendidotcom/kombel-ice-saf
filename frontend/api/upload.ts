import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });

  let uploadFinished = false;
  let fileBuffer: Buffer[] = [];
  let fileName = '';
  let mimeType = '';

  bb.on('file', (_, file, info) => {
    fileName = `${Date.now()}-${info.filename}`;
    mimeType = info.mimeType;
    file.on('data', (data: any) => fileBuffer.push(data));
    file.on('end', () => {
      uploadFinished = true;
    });
  });

  bb.on('finish', async () => {
    if (!uploadFinished) return res.status(400).json({ error: 'No file uploaded' });

    const { error } = await supabase.storage.from('flyers').upload(
      fileName,
      Buffer.concat(fileBuffer),
      {
        contentType: mimeType,
      }
    );

    if (error) return res.status(500).json({ error: 'Upload failed' });

    res.status(200).json({ message: 'Upload berhasil!' });
  });

  req.pipe(bb);
}
