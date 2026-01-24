<div align="center">

# 🌶️ ChiliGuard AI

### Sistem Deteksi Penyakit Tanaman Cabai Berbasis Kecerdasan Buatan

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>🔍 Deteksi penyakit tanaman cabai secara instan menggunakan teknologi AI</strong>
</p>

[🚀 Quick Start](#-quick-start) • [✨ Fitur](#-fitur) • [📦 Instalasi Lengkap](#-instalasi-lengkap) • [🔌 API](#-api-endpoints) • [🤝 Kontribusi](#-kontribusi)

</div>

---

## 📖 Tentang Aplikasi

**ChiliGuard AI** adalah aplikasi web yang menggunakan teknologi **Deep Learning** untuk mendeteksi penyakit pada tanaman cabai melalui foto daun. Cukup arahkan kamera ke daun cabai, ambil foto, dan AI akan menganalisis kondisi tanaman dalam hitungan detik!

### 🎯 Cocok Untuk:
- 👨‍🌾 **Petani Cabai** - Deteksi dini penyakit untuk mencegah gagal panen
- 🎓 **Mahasiswa Pertanian** - Belajar mengidentifikasi penyakit tanaman
- 🔬 **Peneliti** - Analisis cepat kondisi tanaman di lapangan

---

## 🚀 Quick Start

### Prasyarat
- ✅ **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- ✅ **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- ✅ **Git** - [Download Git](https://git-scm.com/)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ThariqAdzikra/chilliguard.git
cd chilliguard
```

### 2️⃣ Setup Backend (Terminal 1)

```bash
# Masuk folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan migrasi database
python manage.py migrate

# Jalankan server backend
python manage.py runserver
```

✅ Backend akan berjalan di: **http://localhost:8000**

### 3️⃣ Setup Frontend (Terminal 2)

```bash
# Masuk folder frontend (dari root project)
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

✅ Frontend akan berjalan di: **http://localhost:3000**

### 4️⃣ Buka Aplikasi

Buka browser dan akses: **http://localhost:3000** 🎉

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 📸 **Scan Real-time** | Ambil foto daun langsung dari kamera |
| 🤖 **AI Detection** | Model deep learning dengan akurasi tinggi |
| 📊 **Hasil Detail** | Informasi lengkap penyakit + tingkat kepercayaan |
| 💊 **Rekomendasi** | Solusi penanganan organik & kimia |
| 📱 **Responsive** | Bisa diakses dari HP, tablet, atau laptop |
| 💬 **AI Chat** | Konsultasi lebih lanjut dengan AI assistant |

---

## 🦠 Penyakit yang Dapat Dideteksi

ChiliGuard dapat mendeteksi **8 kondisi** pada tanaman cabai:

| No | Kondisi | Nama Indonesia | Status |
|----|---------|----------------|--------|
| 1 | **Anthracnose** | Antraknosa | 🔴 Sakit |
| 2 | **Damping Off** | Rebah Kecambah | 🔴 Sakit |
| 3 | **Leaf Curl Virus** | Virus Keriting Daun | 🔴 Sakit |
| 4 | **Leaf Spot** | Bercak Daun | 🔴 Sakit |
| 5 | **Veinal Mottle Virus** | Virus Belang Urat | 🔴 Sakit |
| 6 | **Whitefly** | Kutu Kebul | 🔴 Sakit |
| 7 | **Yellowish** | Daun Menguning | 🔴 Sakit |
| 8 | **Healthy Leaf** | Daun Sehat | 🟢 Sehat |

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animasi
- **Zustand** - State Management
- **React Webcam** - Akses kamera

</td>
<td width="50%" valign="top">

### Backend
- **Django 6.0** - Python Framework
- **Django REST Framework** - API
- **TensorFlow/Keras** - Deep Learning
- **Pillow** - Image Processing
- **PostgreSQL/SQLite** - Database

</td>
</tr>
</table>

---

## 📦 Instalasi Lengkap

### Setup Model Machine Learning

> ⚠️ **Penting:** Pastikan file model ML sudah ada di lokasi yang benar

```bash
# Lokasi file model:
backend/api/ml_models/chiligard_model_v1.h5
```

### Konfigurasi Environment (Opsional)

Buat file `.env` di folder `backend/`:

```env
# Database (default: SQLite)
DATABASE_URL=sqlite:///db.sqlite3

# Atau gunakan PostgreSQL:
# DATABASE_URL=postgres://user:password@host:port/database

# Secret Key Django
SECRET_KEY=your-secret-key-here

# Debug Mode
DEBUG=True
```

---

## 📱 Cara Penggunaan

1. **Buka Aplikasi** - Akses `http://localhost:3000`
2. **Klik "Mulai Scan"** - Masuk ke halaman scan
3. **Izinkan Kamera** - Browser akan meminta izin akses kamera
4. **Arahkan ke Daun** - Posisikan daun cabai di tengah frame
5. **Ambil Foto** - Tekan tombol capture
6. **Lihat Hasil** - AI akan menampilkan diagnosis dalam 2-3 detik
7. **Baca Rekomendasi** - Lihat cara penanganan yang disarankan

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health/` | Cek status API |
| `GET` | `/api/classes/` | Daftar semua kelas penyakit |
| `POST` | `/api/predict/` | Upload gambar untuk prediksi |

### Contoh Request

```bash
# Cek API Status
curl http://localhost:8000/api/health/

# Prediksi Penyakit
curl -X POST http://localhost:8000/api/predict/ \
  -F "image=@foto_daun.jpg"
```

### Contoh Response

```json
{
  "sukses": true,
  "kelas": "Leaf Spot",
  "namaIndonesia": "Bercak Daun",
  "kepercayaan": 0.95,
  "persentaseKepercayaan": 95.0,
  "statusSehat": false,
  "deskripsi": "Penyakit jamur yang menyebabkan bercak pada daun.",
  "gejala": ["Bercak coklat pada daun", "Daun menguning"],
  "penangananOrganik": ["Semprot dengan larutan bawang putih"],
  "penangananKimia": ["Fungisida berbahan aktif mancozeb"],
  "pencegahan": ["Jaga kelembaban", "Rotasi tanaman"]
}
```

---

## 📁 Struktur Proyek

```
chilliguard/
├── 📂 backend/                  # Django Backend API
│   ├── 📂 api/                  # API App
│   │   ├── 📂 ml_models/        # File model ML (.h5)
│   │   ├── 📄 models.py         # Database models
│   │   ├── 📄 views.py          # API Views
│   │   └── 📄 utils.py          # Helper functions
│   ├── 📂 core/                 # Django Settings
│   ├── 📄 manage.py
│   └── 📄 requirements.txt
│
├── 📂 frontend/                 # Next.js Frontend
│   ├── 📂 src/
│   │   ├── 📂 app/              # Pages (App Router)
│   │   │   ├── 📄 page.tsx      # Homepage
│   │   │   ├── 📂 scan/         # Scan page
│   │   │   ├── 📂 result/       # Result page
│   │   │   └── 📂 riwayat/      # History page
│   │   ├── 📂 components/       # React Components
│   │   └── 📂 lib/              # Utilities & Store
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## ❓ Troubleshooting

### Port sudah digunakan
```bash
# Cek proses yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill proses (Windows)
taskkill /PID <PID> /F
```

### Error "Unable to acquire lock"
```bash
# Hapus folder .next dan jalankan ulang
cd frontend
rm -rf .next
npm run dev
```

### Backend tidak bisa konek
```bash
# Pastikan virtual environment aktif
cd backend
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Jalankan ulang server
python manage.py runserver
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! 

1. **Fork** repository ini
2. **Clone** fork Anda: `git clone https://github.com/USERNAME/chilliguard.git`
3. **Buat branch**: `git checkout -b feature/FiturBaru`
4. **Commit**: `git commit -m "Tambah fitur baru"`
5. **Push**: `git push origin feature/FiturBaru`
6. **Buat Pull Request**

---

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Thariq Adzikra**  
📧 GitHub: [@ThariqAdzikra](https://github.com/ThariqAdzikra)

---

<div align="center">

### ⭐ Jika project ini membantu, berikan star ya!

Made with ❤️ for Indonesian Chili Farmers 🌶️

</div>
