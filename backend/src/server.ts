import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Konfigurasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Konfigurasi Multer (pakai memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint untuk upload
app.post('/upload', upload.single('flyer'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('flyers')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype
    });

  if (error) {
    res.status(500).send('Upload failed');
    return;
  }

  res.send('Flyer berhasil diupload!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
