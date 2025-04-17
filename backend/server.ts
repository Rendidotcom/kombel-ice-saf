import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from './db';  // pastikan import ini benar

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Route untuk upload file
app.post("/upload", upload.single("foto"), function (req, res) {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  res.json({
    message: "File uploaded successfully.",
    filename: file.filename,
    path: `/uploads/${file.filename}`,
  });
});

// Static file serving
app.use("/uploads", express.static(uploadDir));

// Route untuk cek koneksi database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      time: result.rows[0].now,
    });
  } catch (err: any) {  // Menangani error dengan tipe 'any'
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Ekspor untuk keperluan Vercel
export default app;
