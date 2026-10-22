// Ambil Elemen
const form = document.querySelector('#formDaftar');
const fields = form.querySelectorAll('input');
const password = document.querySelector('#password');   // BARU: dipakai untuk membandingkan dengan re-type password
const statusForm = document.querySelector('#statusForm');
// (variabel "tanggal" tidak dipakai lagi karena batas tanggal sekarang ada di HTML lewat atribut max)


// Daftar pesan error
// Kunci (nama, email, hp, ...) harus sama dengan id input di HTML
const pesan = 
{
  nama:  { kosong: 'Nama wajib diisi.', 
           pendek: 'Nama minimal 3 huruf.'},
  email: { kosong: 'Email wajib diisi.', 
           format: 'Format email belum benar. Contoh: nama@domain.com'},

  // pesan "kosong" dan "format" untuk nomor HP berbeda,
  // dan pesan format sudah memberi contoh yang benar
  hp:    { kosong: 'Nomor WhatsApp wajib diisi.', 
           format: 'Format nomor salah. Harus diawali 08 dan terdiri dari 10–13 digit angka, contoh: 081234567890.' },

  // pesan untuk password
  password:  { kosong: 'Password wajib diisi.',
               pendek: 'Password minimal 8 karakter.' },

  // pesan untuk re-type password
  password2: { kosong: 'Ulangi password kamu di kolom ini.',
               beda:   'Password dan Re-type Password tidak sama.' },

  // "tanggal" (kehadiran) diganti "lahir" (tanggal lahir)
  lahir: { kosong: 'Tanggal lahir wajib diisi.', 
           muda:   'Usia minimal 20 tahun. Pilih tanggal lahir yang lebih lama.' },
};


// Tampilkan dan hapus error
function showError(input, teks) {
  input.classList.add('is-invalid');           // tampilan merah Bootstrap
  input.setAttribute('aria-invalid', 'true');
  document.getElementById(input.id + '-error').textContent = teks;
  return false;
}
function clearError(input) {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  document.getElementById(input.id + '-error').textContent = '';
  return true;
}


// Pengecekan field 
function cekField(input) {
  const v = input.validity;
  const p = pesan[input.id];

  // DIUBAH: v.valueMissing = true kalau field "required" dibiarkan kosong.
  // trim() tetap dipakai supaya isian yang cuma spasi juga dianggap kosong.
  if (v.valueMissing || input.value.trim() === '') return showError(input, p.kosong);

  // Teks terlalu pendek (minlength): dipakai oleh nama dan password
  if (v.tooShort) return showError(input, p.pendek);

  // Format salah: typeMismatch (email) atau patternMismatch (nomor HP)
  if (v.typeMismatch || v.patternMismatch) return showError(input, p.format);

  // DIUBAH: rangeOverflow = true kalau tanggal lebih besar dari atribut max.
  // Artinya tanggal lahir terlalu baru, jadi usia kurang dari 20 tahun.
  if (v.rangeOverflow) return showError(input, p.muda);

  // khusus re-type password, isinya harus sama dengan password.
  // Pengecekan ini dibuat sendiri karena HTML tidak bisa membandingkan dua field.
  if (input.id === 'password2' && input.value !== password.value) return showError(input, p.beda);

  // Kalau semua lolos, hapus error dan anggap field valid
  return clearError(input);
}

function semuaFieldValid() {
  let valid = true;
  // Semua field dicek satu per satu (tidak berhenti di error pertama),
  // jadi kalau form kosong, semua pesan error langsung muncul bersamaan
  for (const input of fields) {
    if (!cekField(input)) valid = false;
  }
  return valid;
}


// Cek field saat pengguna pindah ke kolom lain (blur)
// (DIHAPUS: bagian "tanggal minimal = hari ini" karena sekarang kita memakai max di HTML)
function pengecekansaatBlur (event) {
 cekField(event.target); 
} 

for (const input of fields) { 
input.addEventListener('blur', pengecekansaatBlur);
 }

// ===== 6. Script untuk proses submit form =====
function saatSubmit(event) {
  event.preventDefault();
  statusForm.className = '';        
  statusForm.textContent = '';

  if (!semuaFieldValid()) {
    // semua pesan error sudah tampil.
    // querySelector mengambil elemen PERTAMA yang cocok (urutan di HTML dari atas),
    // jadi kursor otomatis pindah ke field error yang paling atas.
    // Kalau form kosong semua, field pertama = Nama lengkap.
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  statusForm.textContent = 'Pendaftaran berhasil! Sampai jumpa di workshop.';
  statusForm.className = 'alert alert-success mt-3';
  form.reset();
}

form.addEventListener('submit', saatSubmit);
