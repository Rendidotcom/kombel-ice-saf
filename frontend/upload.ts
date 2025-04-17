const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);

  try {
    const response = await fetch('http://localhost:3000/flyer', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert('Flyer berhasil diupload!');
      uploadForm.reset();
    } else {
      alert('Gagal upload: ' + (result.error || 'Terjadi kesalahan.'));
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    alert('Gagal upload flyer.');
  }
});
