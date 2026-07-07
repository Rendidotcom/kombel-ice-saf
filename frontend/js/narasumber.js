"use strict";

const API_URL =
"https://script.google.com/macros/s/AKfycbwKyJkb5Q6EecNOq785RIO6rqeGl8FlJdVF1fti1-BfPiUd6VNHcL1fP1cFB2J5JyEj_w/exec";

document
.getElementById("narasumberForm")
.addEventListener(
"submit",
async function(e){

e.preventDefault();

const status =
document.getElementById("status");

status.innerHTML =
"⏳ Menyimpan data...";

try{

const nama =
document.getElementById("nama").value.trim();

const judul =
document.getElementById("judul").value.trim();

const tanggal =
document.getElementById("tanggal").value;

const tempat =
document.getElementById("tempat").value.trim();

const waktu =
document.getElementById("waktu").value.trim();

const payload =
new URLSearchParams();

payload.append(
"action",
"saveNarasumber"
);

payload.append(
"nama",
nama
);

payload.append(
"judul",
judul
);

payload.append(
"tanggal",
tanggal
);

payload.append(
"tempat",
tempat
);

payload.append(
"waktu",
waktu
);

const response =
await fetch(
API_URL,
{
method:"POST",
body:payload
}
);

const result =
await response.json();

if(result.success){

status.innerHTML =
"✅ Jadwal berhasil disimpan";

document
.getElementById(
"narasumberForm"
)
.reset();

}else{

status.innerHTML =
"❌ " +
(result.error || "Gagal menyimpan");

}

}catch(err){

status.innerHTML =
"❌ " +
err.message;

}

});
