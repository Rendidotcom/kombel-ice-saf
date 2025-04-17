import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Setup multer untuk menyimpan file
const upload = multer({
  dest: 'uploads/', // folder tempat menyimpan file yang diupload
  limits: { fileSize: 5 * 1024 * 1024 }, // maksimal ukuran file 5MB
});

// Middleware untuk menerima JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint untuk menangani upload flyer
app.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Foto tidak ditemukan!' });
  }

  const { nama, judul_materi, tanggal, tempat, waktu } = req.body;

  // Simpan data ke database atau file sistem
  // Misalnya menyimpan data di log (ganti dengan database)
  console.log({
    nama,
    judul_materi,
    tanggal,
    tempat,
    waktu,
    foto: req.file.filename,
  });

  // Kirim respon sukses
  res.status(200).json({
    message: 'Flyer berhasil diupload!',
    data: { nama, judul_materi, tanggal, tempat, waktu, foto: req.file.filename },
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
import mysql from 'mysql2';

// Membuat koneksi database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'kombel_ice_saf',
});

// Menyimpan data ke database setelah upload
app.post('/upload', upload.single('foto'), (req, res) => {
  const { nama, judul_materi, tanggal, tempat, waktu } = req.body;
  const foto = req.file.filename;

  const query = 'INSERT INTO flyers (nama, judul_materi, tanggal, tempat, waktu, foto) VALUES (?, ?, ?, ?, ?, ?)';

  connection.query(query, [nama, judul_materi, tanggal, tempat, waktu, foto], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal menyimpan ke database', error: err });
    }

    res.status(200).json({ message: 'Flyer berhasil diupload!', data: { nama, judul_materi, tanggal, tempat, waktu, foto } });
  });
});
