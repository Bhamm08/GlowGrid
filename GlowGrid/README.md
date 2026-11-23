# GlowGrid

GlowGrid adalah prototipe website pelaporan partisipatif kondisi penerangan lingkungan dan prioritas rute inspeksi fasilitas publik. Studi kasus menggunakan Kecamatan Pakal, Kota Surabaya, yang terdiri dari Kelurahan Babat Jerawat, Benowo, Pakal, dan Sumber Rejo.

> Catatan: Website ini merupakan proyek akademik dan bukan layanan resmi Pemerintah Kota Surabaya. Semua laporan awal di dalam aplikasi adalah data simulasi.

## Cara menjalankan di VS Code

1. Ekstrak folder `GlowGrid`.
2. Buka folder tersebut melalui **File > Open Folder** di VS Code.
3. Buka folder `dist`, lalu klik kanan `index.html`.
4. Pilih **Open with Live Server**. Jika ekstensi Live Server belum ada, pasang ekstensi tersebut dari menu Extensions.
5. Alternatif tanpa ekstensi: klik dua kali `dist/index.html`. Peta tetap memerlukan koneksi internet untuk memuat tile Esri atau HOT OpenStreetMap.

Tidak diperlukan `npm install`, database, atau framework untuk menjalankan versi prototipe ini.

## Akun/peran simulasi

Gunakan pemilih **Mode** pada kanan atas untuk berpindah peran:

- **Warga**: membuat laporan dengan kategori, prioritas, alamat, dan koordinat dari peta.
- **Admin**: membaca antrean FIFO, memverifikasi laporan, menugaskan teknisi, atau menolak laporan.
- **Teknisi**: melihat tugas, menghitung urutan rute, memperbarui status perjalanan, dan menandai laporan selesai.

## Struktur data yang diterapkan

| Struktur Data | Implementasi | Operasi utama |
|---|---|---|
| Stack | Riwayat perubahan dan tombol undo | `push`, `pop`, `peek` |
| Queue | Antrean laporan yang menunggu verifikasi | `enqueue`, `dequeue`, `front` |
| Linked List | Register laporan yang terus berubah | `append`, `find`, `remove`, `toArray` |
| Tree | Kecamatan → kelurahan → laporan | `addChild`, traversal |
| Rekursif | Menelusuri setiap node pada tree wilayah | `traverseRecursive` |
| Graph | Jaringan antarkelurahan dan depot teknisi | `addVertex`, `addEdge`, Dijkstra `shortestPath` |

Semua struktur data bisa dilihat dan diuji pada menu **Struktur Data**.

## Penyimpanan data

Versi pertama memakai `localStorage` agar seluruh alur dapat langsung dicoba tanpa instalasi server. Data tersimpan pada browser/perangkat yang sama. Untuk memenuhi ketentuan akhir **koneksi database multiple user**, tahap berikutnya adalah mengganti fungsi `loadJSON()` dan `persist()` pada `app.js` dengan API backend (misalnya Node.js + MySQL/Supabase/Firebase) serta menambahkan autentikasi.

## Peta

- Peta pemilih menggunakan Leaflet dengan tile Esri dan cadangan otomatis HOT OpenStreetMap sehingga tetap dapat dibuka melalui `file://` tanpa API key.
- Pengguna dapat memilih lokasi melalui klik peta, lokasi perangkat, atau mengetik koordinat manual lalu menekan **Cari koordinat**.
- Tab **Google Maps lengkap** menyediakan pencarian alamat, gang, tempat, atau fasilitas dan otomatis mengikuti koordinat yang dipilih.
- Setelah titik dipilih, tombol **Buka titik di Google Maps** tersedia untuk memeriksa koordinat pada Google Maps penuh.
- Koordinat kelurahan dipakai sebagai simpul graph simulasi dan bukan koordinat inventaris PJU resmi.

## Sumber konteks studi kasus

- Pemerintah Kota Surabaya, daftar kecamatan dan alamat Kecamatan Pakal: https://www.surabaya.go.id/id/page/0/8132/kecamatan-pakal
- Pemerintah Kota Surabaya, daftar Kecamatan dan Kelurahan: https://pemerintahan.surabaya.go.id/web/kecamatan_kelurahan
- Jawa Pos, keluhan warga RW 6 Babat Jerawat terkait jalan kampung gelap dan rencana pemasangan PJU: https://www.jawapos.com/surabaya-raya/2205130177/respons-keluhan-warga-dishub-surabaya-pasang-pju-di-babat-jerawat
- Leaflet: https://leafletjs.com/
- OpenStreetMap: https://www.openstreetmap.org/
- Esri World Street Map: https://www.arcgis.com/home/item.html?id=3b93337983e9436f8db950e38a8629af
- Google Fonts: https://fonts.google.com/

## Struktur folder

```text
GlowGrid/
├── dist/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .openai/
│   └── hosting.json
└── README.md
```
