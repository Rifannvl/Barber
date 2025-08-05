# Klimis Jaya Barbershop 💈

Aplikasi booking _full-stack_ untuk barbershop modern yang dibangun dari nol menggunakan React, Supabase, dan Tailwind CSS. Proyek ini tidak hanya fungsional, tetapi juga dilengkapi dengan dasbor admin, sistem peran, analitik data, dan _chatbot_ interaktif.

**[🚀 Lihat Demo Live](https://MASUKKAN_LINK_VERCEL_ANDA_DI_SINI)**

---

### Tampilan Aplikasi

|                Tampilan Utama (Light Mode)                |                Tampilan Utama (Dark Mode)                |
| :-------------------------------------------------------: | :------------------------------------------------------: |
| _[Masukkan Screenshot Tampilan Utama Light Mode di Sini]_ | _[Masukkan Screenshot Tampilan Utama Dark Mode di Sini]_ |

|                 Dasbor Analitik                 |           Chatbot Interaktif            |
| :---------------------------------------------: | :-------------------------------------: |
| _[Masukkan Screenshot Dasbor Analitik di Sini]_ | _[Masukkan Screenshot Chatbot di Sini]_ |

---

### 📖 Tentang Proyek Ini

Banyak barbershop modern masih mengandalkan proses manual seperti WhatsApp untuk mengelola booking, yang seringkali tidak efisien dan rentan terhadap kesalahan. "Klimis Jaya" adalah solusi web modern yang dirancang untuk mengatasi masalah ini dengan menyediakan platform booking yang otomatis, intuitif, dan _real-time_.

Proyek ini dibangun sebagai portofolio untuk menunjukkan kemampuan dalam pengembangan aplikasi _full-stack_, mulai dari desain UI/UX, arsitektur database, hingga _deployment_, dengan fokus pada fitur-fitur yang memberikan nilai bisnis nyata.

---

### ✨ Fitur Unggulan

#### Untuk Pelanggan:

- **Booking Dinamis:** Pelanggan dapat memilih kapster, tanggal, dan melihat slot waktu yang tersedia secara _real-time_.
- **Desain Adaptif:** Tampilan yang nyaman diakses baik di desktop maupun mobile.
- **Tema Light & Dark Mode:** Pengguna dapat memilih tema tampilan sesuai preferensi mereka, dan pilihan akan tersimpan.
- **Chatbot Asisten Virtual:** Sebuah _chatbot_ kustom yang dapat menjawab pertanyaan umum seputar jam buka, lokasi, harga, dan layanan.
- **Halaman Lacak Booking:** Pelanggan dapat melacak status booking aktif mereka hanya dengan memasukkan nomor telepon.
- **Animasi Modern:** Transisi dan animasi yang halus menggunakan Framer Motion untuk pengalaman pengguna yang lebih premium.

#### Untuk Admin:

- **Login Aman & Berbasis Peran:** Halaman admin dilindungi dan hanya bisa diakses oleh pengguna dengan peran 'admin'.
- **Dasbor Analitik:** Visualisasi data bisnis penting seperti tren booking harian, total pendapatan, dan performa setiap kapster.
- **Manajemen Booking:** Melihat semua booking yang masuk, dengan kemampuan untuk mengubah statusnya (s/d/b).
- **Manajemen Kapster:** Menambah, mengedit, dan menghapus data kapster.
- **Manajemen Jadwal:** Mengatur jadwal kerja dan hari libur untuk setiap kapster secara individual.

---

### 💻 Teknologi yang Digunakan

- **Frontend:** React, Vite, Tailwind CSS
- **Backend & Database:** Supabase (Auth, Postgres Database, Storage, Edge Functions)
- **Animasi:** Framer Motion
- **Grafik/Chart:** Recharts
- **Styling Tambahan:** PostCSS
- **Library Lain:** `date-fns`, `lucide-react`

---

### 🚀 Menjalankan Proyek Secara Lokal

1.  **Clone repositori ini:**

    ```bash
    git clone [https://github.com/Rifannvl/Barber.git](https://github.com/Rifannvl/Barber.git)
    cd Barber
    ```

2.  **Install semua dependensi:**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**

    - Buat file `.env` di folder utama.
    - Salin isi dari `.env.example` (jika ada) atau isi dengan format berikut:
      ```
      VITE_SUPABASE_URL="URL_PROYEK_SUPABASE_ANDA"
      VITE_SUPABASE_ANON_KEY="ANON_KEY_PUBLIK_ANDA"
      ```

4.  **Setup Database Supabase:**

    - Masuk ke akun Supabase Anda dan buat proyek baru.
    - Jalankan skrip SQL yang ada di dalam proyek ini melalui SQL Editor untuk membuat semua tabel dan fungsi yang diperlukan.

5.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

---

Dibuat dengan ❤️ oleh **[Nama Anda]** - **[Link LinkedIn atau Portofolio Anda]**
