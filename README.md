# GlowGrid — Website Multi-Role

GlowGrid adalah prototipe pelaporan partisipatif kondisi penerangan lingkungan dan prioritas inspeksi berbasis graph untuk studi kasus Kecamatan Pakal, Surabaya. Website memisahkan fitur warga, admin, dan teknisi melalui login serta pemeriksaan role.

> Proyek akademik, bukan layanan resmi Pemerintah Kota Surabaya. Data awal adalah data simulasi.

## Menjalankan di VS Code

1. Ekstrak folder `GlowGrid`.
2. Buka folder melalui **File > Open Folder** di VS Code.
3. Pasang ekstensi **Live Server** jika belum ada.
4. Klik kanan `dist/index.html` dan pilih **Open with Live Server**.
5. Jangan membuka halaman portal langsung sebelum login; pemeriksaan akses akan mengarahkan kembali ke login.

Firebase belum wajib untuk uji awal. Selama `dist/js/firebase-config.js` kosong, website otomatis memakai `localStorage` dan `sessionStorage` sebagai mode demo.

## Akun demo

| Role | Email | Kata sandi | Portal |
|---|---|---|---|
| Warga | `warga@glowgrid.demo` | `Warga123!` | `warga.html` |
| Admin | `admin@glowgrid.demo` | `Admin123!` | `admin.html` |
| Teknisi | `teknisi@glowgrid.demo` | `Teknisi123!` | `teknisi.html` |

Pada halaman login, tombol Warga/Admin/Teknisi dapat mengisi akun demo secara otomatis.

## Pembagian fitur

- **Warga:** registrasi, login, membuat laporan beserta koordinat, klik peta, lokasi perangkat, pencarian koordinat manual, Google Maps, dan riwayat status laporan sendiri.
- **Admin:** melihat semua laporan, memproses queue FIFO, memverifikasi, menolak, dan menugaskan teknisi.
- **Teknisi:** hanya melihat tugas miliknya, membuka lokasi, melihat urutan rute berbasis graph, memulai perjalanan, dan menandai laporan selesai.

Registrasi selalu menghasilkan role `warga`. Role `admin` dan `teknisi` harus diberikan oleh pengelola melalui Firestore agar tidak terjadi peningkatan hak akses dari halaman publik.

## Struktur data

| Struktur | Pemakaian |
|---|---|
| Queue | Antrean verifikasi laporan menggunakan urutan FIFO |
| Linked List | Konsep register laporan yang dinamis |
| Graph | Bobot jaringan wilayah dan urutan inspeksi teknisi |
| Tree | Hirarki kecamatan, kelurahan, dan laporan |
| Rekursif | Penelusuran node pada hirarki wilayah |
| Stack | Konsep riwayat aksi/undo pada pengembangan awal |

## Mengaktifkan Firebase

Baca [FIREBASE_SETUP.md](FIREBASE_SETUP.md). Ringkasnya:

1. Buat Firebase Web App.
2. Aktifkan Authentication Email/Password.
3. Buat Cloud Firestore.
4. Isi `dist/js/firebase-config.js`.
5. Publikasikan `firebase/firestore.rules`.
6. Buat akun admin/teknisi dan atur field `role` pada koleksi `users`.

SDK Firebase dimuat melalui CDN modular versi 13.4.0, sehingga website ini tetap tanpa proses build dan tidak memerlukan `npm install`.

## Struktur folder

```text
GlowGrid/
├── dist/
│   ├── index.html
│   ├── register.html
│   ├── warga.html
│   ├── admin.html
│   ├── teknisi.html
│   ├── styles.css
│   └── js/
│       ├── auth-service.js
│       ├── data-service.js
│       ├── firebase-config.js
│       ├── firebase-service.js
│       └── *-page.js
├── firebase/
│   └── firestore.rules
├── firebase.json
├── FIREBASE_SETUP.md
└── README.md
```

## Catatan peta

Peta pemilih memakai Leaflet dengan tile Esri dan fallback HOT OpenStreetMap. Tab Google Maps memakai embed pencarian. Keduanya memerlukan internet. Koordinat manual dan tautan Google Maps yang memuat koordinat tetap dapat diproses oleh form.
