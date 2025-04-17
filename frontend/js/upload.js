"use strict";

const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Flyer berhasil diupload!");
      uploadForm.reset();
      console.log("Hasil:", result);

      // Optional: Redirect ke index.html setelah upload
      // window.location.href = "/index.html";
    } else {
      alert("Gagal upload: " + (result.error || result.message || "Terjadi kesalahan."));
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    alert("Gagal upload flyer.");
  }
});
