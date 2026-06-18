"use strict";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzfDx5V6PgXMxZJhvMxOMp6JVjo4BNFHaBZM3AKcoNisyWOh9QWoADZxzZxsyp1EBWQHQ/exec";

const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const nama = document.getElementById("nama").value.trim();
    const judul = document.getElementById("judul").value.trim();
    const tanggal = document.getElementById("tanggal").value;
    const tempat = document.getElementById("tempat").value.trim();
    const waktu = document.getElementById("waktu").value.trim();

    const fileInput = document.getElementById("flyer");
    const file = fileInput.files[0];

    if (!nama || !judul || !tanggal || !tempat || !waktu) {
      alert("Lengkapi seluruh data terlebih dahulu.");
      return;
    }

    if (!file) {
      alert("Pilih file flyer terlebih dahulu.");
      return;
    }

    const base64 = await toBase64(file);

    const payload = {
      nama,
      judul,
      tanggal,
      tempat,
      waktu,
      fileName: file.name,
      mimeType: file.type,
      image: base64
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      alert("Flyer berhasil diupload.");

      uploadForm.reset();

      console.log("Upload Success:", result);

      /*
      result.id
      result.fileId
      result.imageUrl
      */
    } else {
      alert(
        "Upload gagal: " +
        (result.error || result.message || "Unknown error")
      );

      console.error(result);
    }

  } catch (error) {

    console.error(error);

    alert(
      "Terjadi kesalahan saat upload:\n" +
      error.message
    );
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });
}
