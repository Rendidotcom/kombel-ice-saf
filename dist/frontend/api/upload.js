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
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handler;
const supabase_js_1 = require("@supabase/supabase-js");
exports.config = {
    api: {
        bodyParser: false,
    },
};
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        const busboy = require('busboy');
        const bb = busboy({ headers: req.headers });
        let uploadFinished = false;
        let fileBuffer = [];
        let fileName = '';
        let mimeType = '';
        // Menambahkan tipe untuk parameter file dan info
        bb.on('file', (_, file, info) => {
            fileName = `${Date.now()}-${info.filename}`;
            mimeType = info.mimeType;
            file.on('data', (data) => fileBuffer.push(data));
            file.on('end', () => {
                uploadFinished = true;
            });
        });
        bb.on('finish', () => __awaiter(this, void 0, void 0, function* () {
            if (!uploadFinished)
                return res.status(400).json({ error: 'No file uploaded' });
            const { error } = yield supabase.storage.from('flyers').upload(fileName, Buffer.concat(fileBuffer), {
                contentType: mimeType,
            });
            if (error)
                return res.status(500).json({ error: 'Upload failed' });
            res.status(200).json({ message: 'Upload berhasil!' });
        }));
        req.pipe(bb);
    });
}
