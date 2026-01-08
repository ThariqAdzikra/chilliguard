<div align="center">

# 🌶️ ChiliGuard AI

### Sistem Deteksi Penyakit Tanaman Cabai Berbasis Kecerdasan Buatan

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>Deteksi penyakit tanaman cabai secara instan menggunakan teknologi AI</strong>
</p>

[Demo](#demo) • [Fitur](#-fitur) • [Instalasi](#-instalasi) • [Penggunaan](#-penggunaan) • [API](#-api-endpoints) • [Kontribusi](#-kontribusi)

</div>

---

## 📖 Tentang

**ChiliGuard AI** adalah aplikasi Progressive Web App (PWA) yang memanfaatkan teknologi Computer Vision dan Deep Learning untuk mendeteksi penyakit pada tanaman cabai. Aplikasi ini membantu petani mengidentifikasi penyakit secara dini dan memberikan rekomendasi penanganan yang tepat.

## ✨ Fitur

- 🔍 **Deteksi Real-time** - Scan daun atau buah cabai menggunakan kamera
- 🧠 **AI-Powered** - Model deep learning dengan akurasi tinggi
- 📊 **Hasil Detail** - Informasi lengkap tentang penyakit dan penanganan
- 💊 **Rekomendasi Penanganan** - Solusi organik dan kimia
- 📱 **PWA Support** - Dapat diinstall sebagai aplikasi mobile
- 💬 **AI Consultant** - Chat dengan AI untuk konsultasi lebih lanjut

## 🦠 Penyakit yang Dapat Dideteksi

| No | Penyakit | Deskripsi |
|----|----------|-----------|
| 1 | **Anthracnose** | Penyakit antraknosa pada buah |
| 2 | **Damping Off** | Rebah kecambah pada bibit |
| 3 | **Leaf Curl Virus** | Virus keriting daun |
| 4 | **Leaf Spot** | Bercak daun |
| 5 | **Veinal Mottle Virus** | Virus belang urat daun |
| 6 | **Whitefly** | Serangan kutu kebul |
| 7 | **Yellowish** | Daun menguning |
| ✅ | **Healthy Leaf/Fruit** | Daun/buah sehat |

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animasi
- **Zustand** - State Management
- **React Webcam** - Akses kamera

### Backend
- **Django 5.0** - Python Web Framework
- **Django REST Framework** - API Development
- **TensorFlow/Keras** - Deep Learning
- **Pillow** - Image Processing

## 📦 Instalasi

### Prasyarat

- Python 3.10+
- Node.js 18+ atau Bun
- Git

### Clone Repository

```bash
git clone https://github.com/ThariqAdzikra/chilliguard.git
cd chilliguard
```

### Setup Backend

```bash
# Masuk ke folder backend
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

# Jalankan migrasi
python manage.py migrate

# Jalankan server
python manage.py runserver
```

### Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies (menggunakan Bun)
bun install

# Atau menggunakan npm
npm install

# Jalankan development server
bun run dev
# atau
npm run dev
```

### Setup Model ML

Letakkan file model `.h5` di:
```
backend/api/ml_models/chiligard_model_v1.h5
```

## 🚀 Penggunaan

1. Buka aplikasi di browser: `http://localhost:3000`
2. Klik tombol **"Mulai Scan"**
3. Arahkan kamera ke daun atau buah cabai
4. Ambil foto atau upload gambar
5. Tunggu hasil analisis AI
6. Lihat detail penyakit dan rekomendasi penanganan

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health/` | Health check API |
| GET | `/api/classes/` | Daftar semua kelas penyakit |
| POST | `/api/predict/` | Upload gambar untuk prediksi |

### Contoh Request Prediksi

```bash
curl -X POST http://localhost:8000/api/predict/ \
  -F "image=@path/to/image.jpg"
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
  "gejala": [...],
  "penangananOrganik": [...],
  "penangananKimia": [...],
  "pencegahan": [...]
}
```

## 📁 Struktur Proyek

```
chilliguard/
├── backend/                 # Django Backend
│   ├── api/                 # API App
│   │   ├── ml_models/       # Model ML (.h5)
│   │   ├── utils.py         # Fungsi inferensi
│   │   └── views.py         # API Views
│   ├── core/                # Django Core
│   │   └── settings.py      # Konfigurasi
│   └── requirements.txt
│
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # React Components
│   │   └── lib/             # Utilities & Store
│   └── package.json
│
└── README.md
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buka issue atau pull request.

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Thariq Adzikra**

- GitHub: [@ThariqAdzikra](https://github.com/ThariqAdzikra)

---

<div align="center">

Made with ❤️ for Indonesian Chili Farmers

</div>
