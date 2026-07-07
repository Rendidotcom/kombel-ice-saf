"use strict";

const API_URL =
"https://script.google.com/macros/s/AKfycbxxIMn8m03XNzrNkd75UONuwVBrgvox5TI0QKoOOtpCc8_UMKkHV1bv_58NgwmZ_amGKQ/exec";

const form =
document.getElementById("uploadForm");

const status =
document.getElementById("status");

const submitBtn =
document.getElementById("submitBtn");

const resultBox =
document.getElementById("resultBox");

const backBtn =
document.getElementById("backBtn");

const viewBtn =
document.getElementById("viewBtn");

const downloadBtn =
document.getElementById("downloadBtn");

form.addEventListener(
"submit",
async function(e){

e.preventDefault();

try{

submitBtn.disabled = true;

status.innerHTML =
"⏳ Mengupload flyer...";

const nama =
document
.getElementById("nama")
.value
.trim();

const tanggal =
document
.getElementById("tanggal")
.value;

const foto =
document
.getElementById("foto")
.files[0];

if(!nama){

status.innerHTML =
"❌ Nama pemateri wajib diisi";

submitBtn.disabled = false;
return;

}

if(!tanggal){

status.innerHTML =
"❌ Tanggal wajib diisi";

submitBtn.disabled = false;
return;

}

if(!foto){

status.innerHTML =
"❌ Pilih flyer terlebih dahulu";

submitBtn.disabled = false;
return;

}

const base64 =
await fileToBase64(foto);
console.log(base64.length);

const payload =
new URLSearchParams();

payload.append(
"action",
"uploadFlyer"
);

payload.append(
"nama",
nama
);

payload.append(
"tanggal",
tanggal
);

payload.append(
"photoName",
foto.name
);

payload.append(
"photoBase64",
base64
);

const response =
await fetch(API_URL,{
method:"POST",
body:payload
});

console.log(response.status);

const text =
await response.text();

console.log(text);

const result =
JSON.parse(text);

if(result.success){

status.innerHTML =
"✅ Flyer berhasil diupload dan data diperbarui";

resultBox.style.display =
"block";

form.reset();

}else{

status.innerHTML =
"❌ " +
(result.error || "Upload gagal");

}

}catch(err){

console.error(err);

status.innerHTML =
"❌ " + err.message;

}

submitBtn.disabled = false;

}
);

function fileToBase64(file){

return new Promise(
(resolve,reject)=>{

const reader =
new FileReader();

reader.onload =
e=>{

const result =
e.target.result;

resolve(
result.split(",")[1]
);

};

reader.onerror =
reject;

reader.readAsDataURL(file);

}
);

}

if(backBtn){

backBtn.onclick =
()=>{

window.location.href =
"flyers.html";

};

}

if(viewBtn){

viewBtn.onclick =
()=>{

window.location.href =
"flyers.html";

};

}

if(downloadBtn){

downloadBtn.onclick =
()=>{

window.location.href =
"index.html";

};

}
