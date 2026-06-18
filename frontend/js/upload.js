"use strict";

alert("UPLOAD JS LOADED");

const API_URL =
"https://script.google.com/macros/s/AKfycbw8R8VkhJvlG1gaFonBSxeD1JBH0rRvA0g1iDo8NJN5D31KXpfK2rK3QkB7crRXTUBGFg/exec";

window.addEventListener("DOMContentLoaded", () => {

  const uploadForm = document.getElementById("uploadForm");

  uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    console.log("SUBMIT CLICKED");

    try {

      const nama =
        document.getElementById("nama").value.trim();

      const judul =
        document.getElementById("judul_materi").value.trim();

      const tanggal =
        document.getElementById("tanggal").value;

      const tempat =
        document.getElementById("tempat").value.trim();

      const waktu =
        document.getElementById("waktu").value.trim();

      const file =
        document.getElementById("foto").files[0];

      if (!nama || !judul || !tanggal || !tempat || !waktu) {

        alert("Lengkapi seluruh data terlebih dahulu.");
        return;

      }

      if (!file) {

        alert("Pilih file flyer terlebih dahulu.");
        return;

      }

      const submitButton =
        document.getElementById("submitBtn");

      submitButton.disabled = true;
      submitButton.textContent = "Mengupload...";

      const base64 =
        await toBase64(file);

      alert(
        "BASE64 LENGTH = " +
        base64.length
      );

      const payload =
        new URLSearchParams();

      payload.append("nama", nama);
      payload.append("judul", judul);
      payload.append("tanggal", tanggal);
      payload.append("tempat", tempat);
      payload.append("waktu", waktu);
      payload.append("photoBase64", base64);
      payload.append("photoName", file.name);

      const response =
        await fetch(API_URL, {
          method: "POST",
          body: payload
        });

      alert(
        "HTTP STATUS = " +
        response.status
      );

      const text =
        await response.text();

      alert(
        "RAW RESPONSE:\n\n" +
        text
      );

      let result;

      try {

        result =
          JSON.parse(text);

      } catch (e) {

        throw new Error(
          "Response bukan JSON:\n\n" +
          text
        );

      }

      if (
        result.success ||
        result.ok ||
        result.status === "success"
      ) {

        alert(
          "✅ Flyer berhasil diupload."
        );

        uploadForm.reset();

      } else {

        alert(
          "❌ Upload gagal:\n\n" +
          (
            result.error ||
            result.message ||
            "Unknown error"
          )
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "❌ TERJADI ERROR:\n\n" +
        error.message
      );

    } finally {

      const submitButton =
        document.getElementById("submitBtn");

      submitButton.disabled = false;
      submitButton.textContent =
        "Kirim Flyer";

    }

  });

});

function toBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = () => {

        resolve(
          reader.result.split(",")[1]
        );

      };

      reader.onerror =
        reject;

      reader.readAsDataURL(file);

    }
  );

}
