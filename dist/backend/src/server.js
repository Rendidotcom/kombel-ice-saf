"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Konfigurasi Supabase
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
// Konfigurasi Multer (pakai memory storage)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Endpoint untuk upload
app.post('/upload', upload.single('flyer'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded');
        return;
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const { error } = yield supabase.storage
        .from('flyers')
        .upload(fileName, file.buffer, {
        contentType: file.mimetype
    });
    if (error) {
        res.status(500).send('Upload failed');
        return;
    }
    res.send('Flyer berhasil diupload!');
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
