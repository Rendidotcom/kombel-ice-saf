const form = document.getElementById("flyerForm") as HTMLFormElement;
const status = document.getElementById("status") as HTMLParagraphElement;

form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:3000/flyer", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    status.innerText = response.ok
      ? "Berhasil upload flyer!"
      : `Gagal: ${text}`;
    form.reset();
  } catch (error) {
    status.innerText = "Terjadi kesalahan saat mengirim data.";
    console.error("Upload error:", error);
  }
});
