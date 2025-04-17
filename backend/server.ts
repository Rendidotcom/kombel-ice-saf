import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // sesuaikan
  database: "kombel_ice_saf",
});

// Multer untuk upload foto
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint untuk menyimpan flyer
app.post("/flyer", upload.single("foto"), (req, res) => {
  const { nama, judul_materi, tanggal, tempat, waktu } = req.body;
  const foto = req.file ? req.file.filename : null;

  const sql = `INSERT INTO flyer (nama, judul_materi, foto, tanggal, tempat, waktu)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nama, judul_materi, foto, tanggal, tempat, waktu], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Flyer berhasil disimpan");
  });
});

// Endpoint untuk menampilkan semua flyer
app.get("/flyer", (_req, res) => {
  db.query("SELECT * FROM flyer ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
