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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = 'https://jmmqpqbpdmaelfnjhgly.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Jangan ubah!
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
(_a = document.getElementById('uploadForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    e.preventDefault();
    const fileInput = document.getElementById('flyer');
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return alert('Pilih file terlebih dahulu!');
    const filePath = `${Date.now()}_${file.name}`;
    const { error } = yield supabase.storage
        .from('flyers')
        .upload(filePath, file);
    if (error) {
        console.error(error);
        alert('Gagal upload: ' + error.message);
    }
    else {
        alert('Upload berhasil!');
    }
}));
