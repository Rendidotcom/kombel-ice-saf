import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

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

app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Tambahkan ekspor default agar bisa digunakan di Vercel
export default app;
