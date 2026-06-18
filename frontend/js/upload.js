"use strict";

alert("UPLOAD JS LOADED");

const API_URL =
"https://script.google.com/macros/s/AKfycbxYAPyK6DpYkFNETP42hw5g-4-eLzaCCgS2xP1Z8kTVT9WFYGd_9hQ7-mzUaB_kywo9ew/exec";

window.addEventListener("DOMContentLoaded", () => {

  const uploadForm = document.getElementById("uploadForm");

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("SUBMIT CLICKED");

    try {

      const nama = document.getElementById("nama").value.trim();
      const judul = document.getElementById("judul_materi").value.trim();
      const tanggal = document.getElementById("tanggal").value;
      const tempat = document.getElementById("tempat").value.trim();
      const waktu = document.getElementById("waktu").value.trim();
      const file = document.getElementById("foto").files[0];

      if (!nama || !judul || !tanggal || !tempat || !waktu) {
        alert("Lengkapi seluruh data terlebih dahulu.");
        return;
      }

      if (!file) {
        alert("Pilih file flyer terlebih dahulu.");
        return;
      }

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.textContent = "Mengupload...";

      const base64 = await toBase64(file);

      const payload = new URLSearchParams();
      payload.append("nama", nama);
      payload.append("judul", judul);
      payload.append("tanggal", tanggal);
      payload.append("tempat", tempat);
      payload.append("waktu", waktu);
      payload.append("photoBase64", base64);
      payload.append("photoName", file.name);

      const response = await fetch(API_URL, {
        method: "POST",
        body: payload
      });

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error("Response bukan JSON: " + text);
      }

      if (result.success || result.ok || result.status === "success") {
        alert("✅ Flyer berhasil diupload.");
        uploadForm.reset();
        console.log(result);
      } else {
        alert("❌ Upload gagal:\n\n" + (result.error || result.message || "Unknown error"));
        console.error(result);
      }

    } catch (error) {
      console.error(error);
      alert("❌ Terjadi kesalahan:\n\n" + error.message);
    } finally {
      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = false;
      submitButton.textContent = "Kirim Flyer";
    }
  });
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
