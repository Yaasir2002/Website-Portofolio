# 🚀 Full-Stack Personal Portfolio & Admin Dashboard

Website Portofolio Personal Full-Stack dengan tampilan minimalis, animasi dinamis, dan dilengkapi Dashboard Admin untuk mengelola konten, kategori, profil.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS v3 + Custom Glassmorphism & Cyber Glow Palette
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Analytics Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose Schema)
- **Auth**: JWT (JSON Web Tokens) & bcryptjs
- **Upload**: Multer (Local Storage `/uploads`)
- **Security**: Express Rate Limiting & Input Sanitization

---

## 📂 Struktur Direktori

```text
Web Portofolio/
├── backend/
│   ├── config/          # Konfigurasi Database MongoDB
│   ├── controllers/     # Controller Auth, Portfolio, Category, Message, Analytics
│   ├── middleware/      # Middleware JWT Protect & Multer File Upload
│   ├── models/          # Mongoose Schema (User, Portfolio, Category, Visitor, Message)
│   ├── routes/          # Express API Endpoints
│   ├── uploads/         # Direktori Penyimpanan File Media
│   ├── .env             # Environment variables runtime
│   ├── .env.example     # Environment template
│   ├── seed.js          # Database Seeder (Membuat Admin & Portofolio Awal)
│   ├── server.js        # Entry point server Express
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # CustomCursor, Navbar, Hero, About, Portfolio, Skills, Contact, Footer
    │   ├── context/     # AuthContext (JWT Admin Login State)
    │   ├── pages/       # Home, AdminLogin, AdminDashboard, AdminPortfolios, AdminCategories, AdminProfile, AdminMessages
    │   ├── services/    # Axios API Client
    │   ├── styles/      # index.css (Glassmorphism & Utilities)
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Panduan Cara Menjalankan (Local Setup)

### 1. Persiapan Backend
```bash
cd backend
npm install
```

#### Menjalankan Database Seeder (Opsional / Sangat Direkomendasikan)
Perintah ini akan membuat akun admin default dan mengisikan portofolio sampel untuk 6 kategori wajib:
```bash
npm run seed
```
> **Kredensial Default Admin:**
> - **Username**: `admin`
> - **Password**: `admin123`

#### Menjalankan Server Backend
```bash
npm run dev
# Server akan berjalan di http://localhost:5000
```

### 2. Persiapan Frontend
```bash
cd frontend
npm install
npm run dev
# Application akan berjalan di http://localhost:5173
```

---

## 🎯 Halaman & Fitur Utama

1. **Website Publik (`/`)**
   - **Hero Section**: Foto profil organik dengan aura animasi glow, nama, tagline, dan tombol CTA.
   - **About Section**: Bio interaktif, prinsip kerja, serta timeline pengalaman & edukasi.
   - **Portfolio Gallery**: Filter tab kategori (*UI/UX Design, Web Development, Branding, Mobile App, Graphic Design, Video / Motion Graphic*), search bar, masonry grid, hover effect unik, dan Detail Modal.
   - **Skills & Tools**: Scroll-reveal badge ikon tools & progress bar keahlian.
   - **Contact Form**: Formulir kontak interaktif yang terhubung langsung ke backend database.

2. **Admin Panel (Protected `/admin/login`)**
   - **Dashboard Analytics**: Ringkasan total data, grafik kunjungan harian (Recharts), portofolio terpopuler, dan sumber traffic.
   - **Kelola Portofolio**: CRUD lengkap (Tambah, Edit, Hapus karya, upload gambar/video).
   - **Kelola Kategori**: Tambah/edit/hapus kategori.
   - **Pengaturan Profil**: Ubah foto profil, nama, bio, dan sosmed secara dinamis tanpa sentuh kode.
   - **Pesan Masuk**: Inbox pesan dari formulir kontak.
