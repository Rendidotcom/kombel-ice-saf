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
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    try {
        const response = yield fetch('http://localhost:3000/flyer', {
            method: 'POST',
            body: formData,
        });
        const result = yield response.json();
        if (response.ok) {
            alert('Flyer berhasil diupload!');
            uploadForm.reset();
        }
        else {
            alert('Gagal upload: ' + (result.error || 'Terjadi kesalahan.'));
        }
    }
    catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Gagal upload flyer.');
    }
}));
