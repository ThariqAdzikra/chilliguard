# 📚 Modul Pembelajaran ChiliGuard AI

> **Panduan lengkap untuk memahami proyek ChiliGuard dari nol hingga mahir**

Modul ini dirancang untuk pemula yang ingin mempelajari Django, Next.js, dan TypeScript melalui proyek nyata.

---

## 📋 Daftar Isi

1. [Pengenalan & Arsitektur Proyek](#modul-1-pengenalan--arsitektur-proyek)
2. [Django Backend Dasar](#modul-2-django-backend-dasar)
3. [Django REST Framework & API](#modul-3-django-rest-framework--api)
4. [Machine Learning Integration](#modul-4-machine-learning-integration)
5. [Next.js & TypeScript Dasar](#modul-5-nextjs--typescript-dasar)
6. [React Components & State Management](#modul-6-react-components--state-management)
7. [Integrasi Frontend-Backend](#modul-7-integrasi-frontend-backend)
8. [Styling dengan Tailwind CSS](#modul-8-styling-dengan-tailwind-css)

---

# Modul 1: Pengenalan & Arsitektur Proyek

## 🎯 Apa itu ChiliGuard?

ChiliGuard adalah aplikasi web untuk **mendeteksi penyakit tanaman cabai** menggunakan AI/Machine Learning. Pengguna cukup memfoto daun cabai, lalu AI akan menganalisis dan memberikan diagnosis.

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │   API   │    BACKEND      │
│   (Next.js)     │ ──────► │    (Django)     │
│   Port: 3000    │         │    Port: 8000   │
└─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  ML Model       │
                            │  (TensorFlow)   │
                            └─────────────────┘
```

## 📁 Struktur Folder

```
chilliguard/
├── backend/                 # Django Backend
│   ├── api/                 # Aplikasi API utama
│   │   ├── views.py         # Endpoint handlers
│   │   ├── urls.py          # Routing URL
│   │   ├── utils.py         # Fungsi utilitas & ML
│   │   └── ml_models/       # File model AI (.keras)
│   ├── core/                # Konfigurasi Django
│   │   ├── settings.py      # Pengaturan proyek
│   │   └── urls.py          # URL root
│   └── manage.py            # CLI Django
│
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Halaman (App Router)
│   │   │   ├── page.tsx     # Halaman utama
│   │   │   ├── scan/        # Halaman scanner
│   │   │   └── result/      # Halaman hasil
│   │   ├── components/      # Komponen React
│   │   │   ├── Scanner.tsx  # Komponen kamera
│   │   │   └── Navbar.tsx   # Navigasi
│   │   └── lib/             # Utilitas
│   │       ├── api.ts       # Fungsi API
│   │       └── store.ts     # State management
│   └── package.json         # Dependencies
│
└── README.md
```

---

# Modul 2: Django Backend Dasar

## 🐍 Apa itu Django?

Django adalah **web framework Python** yang mengikuti pola MVT (Model-View-Template). Dalam proyek ini, kita menggunakan Django sebagai **REST API backend**.

## 📝 File Penting

### 1. `manage.py` - Entry Point Django

```python
# manage.py
#!/usr/bin/env python
import os
import sys

def main():
    # Tentukan settings module yang digunakan
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    # Jalankan command line Django
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
```

**Penjelasan:**
- File ini adalah "pintu masuk" untuk menjalankan perintah Django
- Contoh penggunaan: `python manage.py runserver`

### 2. `core/settings.py` - Konfigurasi Proyek

```python
# Bagian-bagian penting settings.py

# 1. PATH DASAR - Lokasi folder proyek
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. SECRET KEY - Kunci rahasia untuk keamanan
SECRET_KEY = 'django-insecure-xxxxx'  # Ganti di production!

# 3. DEBUG MODE - Aktifkan saat development
DEBUG = True

# 4. ALLOWED HOSTS - Domain yang diizinkan
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# 5. INSTALLED APPS - Aplikasi yang terpasang
INSTALLED_APPS = [
    'django.contrib.admin',      # Panel admin
    'django.contrib.auth',       # Autentikasi
    'rest_framework',            # Django REST Framework
    'corsheaders',               # Untuk CORS
    'api',                       # Aplikasi kita
]

# 6. MIDDLEWARE - Proses request/response
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS harus di atas!
    'django.middleware.security.SecurityMiddleware',
    # ... middleware lainnya
]

# 7. CORS - Izinkan frontend mengakses API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Frontend Next.js
]

# 8. DATABASE - Konfigurasi database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 9. KONFIGURASI ML MODEL
MODEL_PATH = os.path.join(BASE_DIR, 'api', 'ml_models', 'chiligard_model_v1.keras')
UKURAN_GAMBAR_INPUT = (224, 224)  # Input size untuk model

# 10. DAFTAR KELAS PENYAKIT
DAFTAR_KELAS_PENYAKIT = [
    'Anthracnose',      # Antraknosa
    'Damping Off',      # Rebah Kecambah
    'Healthy Fruit',    # Buah Sehat
    'Healthy Leaf',     # Daun Sehat
    'Leaf Curl',        # Keriting Daun
    'Leaf Spot',        # Bercak Daun
    'Veinal Mottle',    # Belang Urat
    'Whitefly',         # Kutu Kebul
    'Yellowish',        # Menguning
]
```

**Konsep Penting:**
| Setting | Fungsi |
|---------|--------|
| `INSTALLED_APPS` | Mendaftarkan aplikasi yang aktif |
| `MIDDLEWARE` | Layer pemrosesan request |
| `CORS_ALLOWED_ORIGINS` | Domain yang boleh akses API |
| `DATABASES` | Konfigurasi database |

---

# Modul 3: Django REST Framework & API

## 🔌 Apa itu REST API?

REST API adalah cara frontend berkomunikasi dengan backend melalui HTTP request (GET, POST, PUT, DELETE).

```
Frontend ──POST /api/predict/──► Backend ──► Response JSON
```

## 📝 Membuat Endpoint API

### 1. `api/urls.py` - Routing URL

```python
from django.urls import path
from .views import PrediksiView, KesehatanView, DaftarKelasView

app_name = 'api'  # Namespace untuk URL

urlpatterns = [
    # URL Pattern                  View Class              Nama URL
    path('predict/', PrediksiView.as_view(), name='prediksi'),
    path('health/',  KesehatanView.as_view(), name='kesehatan'),
    path('classes/', DaftarKelasView.as_view(), name='daftar-kelas'),
]
```

**Penjelasan:**
- `path()` menghubungkan URL dengan View
- `as_view()` mengkonversi class menjadi function view
- `name` untuk referensi URL di template

### 2. `api/views.py` - Request Handler

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .utils import klasifikasiGambar, dapatkanInfoPenyakit


class PrediksiView(APIView):
    """
    Endpoint untuk prediksi penyakit.
    
    Request: POST dengan file gambar
    Response: JSON dengan hasil diagnosis
    """
    
    # Parser untuk menerima file upload
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        # 1. AMBIL FILE GAMBAR
        fileGambar = request.FILES.get('image')
        
        # 2. VALIDASI - Pastikan file ada
        if not fileGambar:
            return Response(
                {'sukses': False, 'pesan': 'File gambar tidak ditemukan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 3. VALIDASI - Cek tipe file
        tipeValid = ['image/jpeg', 'image/png', 'image/webp']
        if fileGambar.content_type not in tipeValid:
            return Response(
                {'sukses': False, 'pesan': 'Tipe file tidak valid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 4. VALIDASI - Cek ukuran (max 10MB)
        if fileGambar.size > 10 * 1024 * 1024:
            return Response(
                {'sukses': False, 'pesan': 'File terlalu besar'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 5. PROSES KLASIFIKASI
        hasil = klasifikasiGambar(fileGambar)
        
        if not hasil['sukses']:
            return Response(hasil, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # 6. AMBIL INFO PENYAKIT
        infoPenyakit = dapatkanInfoPenyakit(hasil['kelas'])
        
        # 7. KIRIM RESPONSE
        return Response({
            'sukses': True,
            'kelas': hasil['kelas'],
            'namaIndonesia': infoPenyakit.get('namaIndonesia'),
            'kepercayaan': hasil['kepercayaan'],
            'deskripsi': infoPenyakit.get('deskripsi'),
            'gejala': infoPenyakit.get('gejala', []),
            'penangananOrganik': infoPenyakit.get('penangananOrganik', []),
            'penangananKimia': infoPenyakit.get('penangananKimia', []),
            'pencegahan': infoPenyakit.get('pencegahan', []),
        }, status=status.HTTP_200_OK)


class KesehatanView(APIView):
    """Health check endpoint - untuk cek apakah API aktif"""
    
    def get(self, request):
        return Response({
            'status': 'aktif',
            'pesan': 'ChiliGuard API berjalan dengan baik',
            'versi': '1.0.0'
        })
```

**Alur Request:**
```
1. Client POST /api/predict/ dengan gambar
2. Django routing ke PrediksiView.post()
3. Validasi file (ada, tipe valid, ukuran ok)
4. Panggil klasifikasiGambar() untuk prediksi
5. Dapatkan info penyakit
6. Return Response JSON
```

**HTTP Status Codes:**
| Code | Arti | Kapan Digunakan |
|------|------|-----------------|
| 200 | OK | Request berhasil |
| 400 | Bad Request | Data tidak valid |
| 500 | Server Error | Error di server |

---

# Modul 4: Machine Learning Integration

## 🤖 Bagaimana AI Bekerja?

```
Gambar ──► Preprocessing ──► Model TensorFlow ──► Probabilitas ──► Kelas Penyakit
```

### `api/utils.py` - Fungsi ML

```python
import numpy as np
from PIL import Image
from io import BytesIO
from django.conf import settings

# VARIABEL GLOBAL - Model dimuat sekali
_modelTerlatih = None


def muatModel():
    """
    Memuat model TensorFlow.
    Model hanya dimuat sekali dan disimpan di memori.
    """
    global _modelTerlatih
    
    # Jika sudah dimuat, langsung return
    if _modelTerlatih is not None:
        return _modelTerlatih
    
    # Cek apakah file model ada
    jalurModel = settings.MODEL_PATH
    if not os.path.exists(jalurModel):
        print(f"[PERINGATAN] Model tidak ditemukan: {jalurModel}")
        return None
    
    # Muat model
    from tensorflow import keras
    _modelTerlatih = keras.models.load_model(jalurModel)
    print("[SUKSES] Model berhasil dimuat")
    return _modelTerlatih


def prosesGambar(fileGambar):
    """
    Preprocessing gambar untuk input model.
    
    Langkah:
    1. Baca file gambar
    2. Konversi ke RGB
    3. Resize ke 224x224
    4. Normalisasi (0-255 → 0-1)
    5. Tambah dimensi batch
    """
    # Baca gambar
    konten = fileGambar.read()
    gambar = Image.open(BytesIO(konten))
    
    # Konversi ke RGB (handle RGBA, grayscale, dll)
    if gambar.mode != 'RGB':
        gambar = gambar.convert('RGB')
    
    # Resize ke ukuran model
    ukuran = settings.UKURAN_GAMBAR_INPUT  # (224, 224)
    gambar = gambar.resize(ukuran, Image.Resampling.LANCZOS)
    
    # Konversi ke numpy array
    arrayGambar = np.array(gambar, dtype=np.float32)
    
    # Normalisasi: nilai pixel 0-255 → 0-1
    arrayGambar = arrayGambar / 255.0
    
    # Tambah dimensi batch: (224,224,3) → (1,224,224,3)
    arrayGambar = np.expand_dims(arrayGambar, axis=0)
    
    return arrayGambar


def klasifikasiGambar(fileGambar):
    """
    Fungsi utama untuk klasifikasi gambar.
    """
    # Muat model
    model = muatModel()
    
    if model is None:
        # Mode demo jika model belum ada
        return {
            'sukses': True,
            'kelas': 'Healthy Leaf',
            'kepercayaan': 0.95,
            'pesan': 'Mode demo'
        }
    
    try:
        # Proses gambar
        gambarInput = prosesGambar(fileGambar)
        
        # Prediksi - model.predict() return array probabilitas
        hasilPrediksi = model.predict(gambarInput, verbose=0)
        
        # Ambil probabilitas tertinggi
        probabilitas = hasilPrediksi[0]  # Shape: (9,) untuk 9 kelas
        indeksTertinggi = np.argmax(probabilitas)
        nilaiKepercayaan = float(probabilitas[indeksTertinggi])
        
        # Mapping indeks ke nama kelas
        kelasTedeteksi = settings.DAFTAR_KELAS_PENYAKIT[indeksTertinggi]
        
        return {
            'sukses': True,
            'kelas': kelasTedeteksi,
            'kepercayaan': nilaiKepercayaan,
        }
        
    except Exception as e:
        return {
            'sukses': False,
            'pesan': f'Error: {str(e)}'
        }
```

**Konsep Kunci:**

1. **Singleton Pattern**: Model dimuat sekali pakai variabel global
2. **Preprocessing**: Gambar harus diubah ke format yang model pahami
3. **Normalisasi**: Nilai pixel 0-255 dibagi 255 menjadi 0-1
4. **np.argmax**: Mencari indeks dengan nilai tertinggi
5. **Batch Dimension**: Model TensorFlow butuh dimensi batch (1, H, W, C)

---

# Modul 5: Next.js & TypeScript Dasar

## ⚛️ Apa itu Next.js?

Next.js adalah **React framework** dengan fitur:
- Server-Side Rendering (SSR)
- App Router (folder-based routing)
- Built-in optimisasi (gambar, font, dll)

## 📘 Apa itu TypeScript?

TypeScript adalah **JavaScript dengan tipe data**. Membantu menangkap error sebelum runtime.

```typescript
// JavaScript biasa
const nama = "Thariq";
nama = 123;  // ❌ Error tapi tidak ketahuan sampai runtime

// TypeScript
const nama: string = "Thariq";
nama = 123;  // ❌ Error langsung terlihat di editor!
```

## 📝 Struktur Dasar Next.js

### 1. `layout.tsx` - Layout Global

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. KONFIGURASI FONT
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",  // CSS variable
});

// 2. METADATA SEO
export const metadata: Metadata = {
  title: "ChiliGuard AI - Deteksi Penyakit Tanaman Cabai",
  description: "Aplikasi deteksi penyakit tanaman cabai menggunakan AI",
  keywords: ["deteksi penyakit cabai", "AI tanaman", "ChiliGuard"],
};

// 3. ROOT LAYOUT COMPONENT
export default function RootLayout({
  children,  // Konten halaman
}: {
  children: React.ReactNode;  // Tipe TypeScript
}) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans`}>
        {/* Background Gradient */}
        <div className="fixed inset-0 gradient-mesh -z-10" />
        
        {/* Konten Halaman */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**Penjelasan:**
- `layout.tsx` membungkus semua halaman
- `children` adalah konten dari halaman aktif
- `Metadata` untuk SEO (title, description, dll)

### 2. `page.tsx` - Halaman

```tsx
// src/app/page.tsx - Halaman utama (/)
"use client";  // Menandakan ini Client Component

import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, Scan, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BerandaPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center">
        <h1 className="text-5xl font-black">
          Lindungi Cabai
          <span className="text-emerald-500">Dengan AI</span>
        </h1>
        
        {/* Tombol CTA */}
        <Link href="/scan">
          <Button className="bg-emerald-500 text-white">
            <Scan className="w-6 h-6 mr-3" />
            Mulai Scan Sekarang
          </Button>
        </Link>
      </section>
    </div>
  );
}
```

**Routing di Next.js App Router:**
```
src/app/
├── page.tsx        → /
├── scan/
│   └── page.tsx    → /scan
├── result/
│   └── page.tsx    → /result
└── riwayat/
    └── page.tsx    → /riwayat
```

### 3. Client vs Server Components

```tsx
// SERVER COMPONENT (default)
// - Tidak bisa pakai state, effect, event handler
// - Render di server, kirim HTML ke client
export default function ServerPage() {
  return <h1>Ini Server Component</h1>;
}

// CLIENT COMPONENT
// - Bisa pakai useState, useEffect, onClick
// - Render di browser
"use client";  // ← Direktif ini wajib!

import { useState } from "react";

export default function ClientPage() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Diklik {count} kali
    </button>
  );
}
```

---

# Modul 6: React Components & State Management

## 🧩 Memahami Component

Component adalah **blok bangunan** UI React yang reusable.

### 1. `Scanner.tsx` - Komponen Kamera

```tsx
// src/components/Scanner.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

// 1. INTERFACE - Definisi tipe props
interface ScannerProps {
  onCapture: (gambarBase64: string) => void;  // Callback saat gambar diambil
  sedangMemproses?: boolean;                   // Loading state (opsional)
}

// 2. KONFIGURASI WEBCAM
const constraintVideo = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "environment",  // Kamera belakang
};

// 3. COMPONENT FUNCTION
export default function Scanner({ onCapture, sedangMemproses = false }: ScannerProps) {
  // REFS - Referensi ke elemen DOM
  const webcamRef = useRef<Webcam>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  
  // STATE - Data yang berubah
  const [kameraSiap, setKameraSiap] = useState(false);
  const [errorKamera, setErrorKamera] = useState<string | null>(null);

  // CALLBACK - Fungsi yang di-memoize
  const handleKameraSiap = useCallback(() => {
    setKameraSiap(true);
    setErrorKamera(null);
  }, []);

  const ambilGambar = useCallback(() => {
    if (!webcamRef.current || sedangMemproses) return;
    
    // Ambil screenshot dari webcam sebagai base64
    const gambarBase64 = webcamRef.current.getScreenshot();
    if (gambarBase64) {
      onCapture(gambarBase64);  // Panggil callback dari parent
    }
  }, [onCapture, sedangMemproses]);

  return (
    <div className="relative w-full h-full">
      {/* Webcam Component */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={constraintVideo}
        onUserMedia={handleKameraSiap}
        onUserMediaError={(err) => setErrorKamera("Gagal akses kamera")}
      />
      
      {/* Tombol Capture */}
      <button onClick={ambilGambar} disabled={!kameraSiap}>
        📸 Ambil Foto
      </button>
    </div>
  );
}
```

**Konsep React Hooks:**

| Hook | Fungsi | Contoh |
|------|--------|--------|
| `useState` | State component | `const [nilai, setNilai] = useState(0)` |
| `useRef` | Referensi ke DOM | `const ref = useRef(null)` |
| `useCallback` | Memoize function | `useCallback(() => {}, [deps])` |
| `useEffect` | Side effects | `useEffect(() => {}, [deps])` |

### 2. `store.ts` - State Management dengan Zustand

```typescript
// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HasilPrediksi } from './api';

// 1. INTERFACE - Definisi struktur state
interface StateAplikasi {
  // Data
  gambarTangkapan: string | null;
  sedangMemproses: boolean;
  hasilPrediksi: HasilPrediksi | null;
  riwayatDiagnosis: ItemRiwayat[];
  
  // Actions (fungsi untuk mengubah state)
  setGambarTangkapan: (gambar: string | null) => void;
  setSedangMemproses: (status: boolean) => void;
  setHasilPrediksi: (hasil: HasilPrediksi | null) => void;
  tambahRiwayat: (item: ItemRiwayat) => void;
  resetState: () => void;
}

// 2. STATE AWAL
const stateAwal = {
  gambarTangkapan: null,
  sedangMemproses: false,
  hasilPrediksi: null,
  riwayatDiagnosis: [],
};

// 3. CREATE STORE
export const useStore = create<StateAplikasi>()(
  persist(
    (set) => ({
      ...stateAwal,

      // ACTIONS
      setGambarTangkapan: (gambar) => 
        set({ gambarTangkapan: gambar }),
      
      setSedangMemproses: (status) => 
        set({ sedangMemproses: status }),
      
      setHasilPrediksi: (hasil) => 
        set({ hasilPrediksi: hasil }),
      
      tambahRiwayat: (item) =>
        set((state) => ({
          riwayatDiagnosis: [item, ...state.riwayatDiagnosis].slice(0, 50),
        })),
      
      resetState: () => set(stateAwal),
    }),
    {
      name: 'chilliguard-storage',  // Key di localStorage
      partialize: (state) => ({
        riwayatDiagnosis: state.riwayatDiagnosis,  // Hanya simpan riwayat
      }),
    }
  )
);
```

**Cara Pakai Zustand:**

```tsx
// Di component manapun
import { useStore } from '@/lib/store';

function MyComponent() {
  // Ambil state dan actions yang dibutuhkan
  const { gambarTangkapan, sedangMemproses, setGambarTangkapan } = useStore();
  
  return (
    <div>
      {sedangMemproses && <p>Loading...</p>}
      <button onClick={() => setGambarTangkapan("data:image/...")}>
        Set Gambar
      </button>
    </div>
  );
}
```

---

# Modul 7: Integrasi Frontend-Backend

## 🔗 Komunikasi API

### `api.ts` - Fungsi API Client

```typescript
// src/lib/api.ts

// 1. URL BACKEND dari environment variable
const URL_API_BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// 2. INTERFACE UNTUK RESPONSE
export interface HasilPrediksi {
  sukses: boolean;
  kelas: string;
  namaIndonesia: string;
  kepercayaan: number;
  persentaseKepercayaan: number;
  statusSehat: boolean;
  deskripsi: string;
  gejala: string[];
  penangananOrganik: string[];
  penangananKimia: string[];
  pencegahan: string[];
}

// 3. FUNGSI KIRIM PREDIKSI
export async function kirimPrediksi(fileGambar: File): Promise<HasilPrediksi> {
  // Buat FormData untuk upload file
  const formData = new FormData();
  formData.append('image', fileGambar);

  try {
    // Kirim POST request ke backend
    const response = await fetch(`${URL_API_BACKEND}/predict/`, {
      method: 'POST',
      body: formData,
    });

    // Cek apakah response OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.pesan || `HTTP error: ${response.status}`);
    }

    // Parse JSON response
    const data: HasilPrediksi = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat mengirim prediksi:', error);
    throw error;
  }
}

// 4. KONVERSI BASE64 KE FILE
export function base64KeFile(dataBase64: string, namaFile: string = 'capture.jpg'): File {
  // Hapus prefix "data:image/jpeg;base64,"
  const base64Bersih = dataBase64.replace(/^data:image\/\w+;base64,/, '');
  
  // Decode base64 ke binary
  const byteString = atob(base64Bersih);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  // Buat File object
  const blob = new Blob([uint8Array], { type: 'image/jpeg' });
  return new File([blob], namaFile, { type: 'image/jpeg' });
}

// 5. KOMPRESI GAMBAR
export async function kompresGambar(
  fileGambar: File,
  kualitas: number = 0.8,
  ukuranMaksimal: number = 1024
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let lebar = img.width;
        let tinggi = img.height;
        
        // Resize jika terlalu besar
        if (lebar > ukuranMaksimal || tinggi > ukuranMaksimal) {
          if (lebar > tinggi) {
            tinggi = (tinggi / lebar) * ukuranMaksimal;
            lebar = ukuranMaksimal;
          } else {
            lebar = (lebar / tinggi) * ukuranMaksimal;
            tinggi = ukuranMaksimal;
          }
        }
        
        canvas.width = lebar;
        canvas.height = tinggi;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, lebar, tinggi);
        
        // Konversi canvas ke blob dengan kompresi
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengkompresi'));
              return;
            }
            resolve(new File([blob], fileGambar.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          kualitas
        );
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.readAsDataURL(fileGambar);
  });
}
```

### Alur Lengkap: Scan → Result

```tsx
// src/app/scan/page.tsx

"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Scanner from "@/components/Scanner";
import { useStore, generateId } from "@/lib/store";
import { kirimPrediksi, base64KeFile, kompresGambar } from "@/lib/api";

export default function ScanPage() {
  const router = useRouter();
  
  // Ambil state dan actions dari Zustand store
  const {
    setGambarTangkapan,
    setSedangMemproses,
    setHasilPrediksi,
    tambahRiwayat,
    sedangMemproses,
  } = useStore();

  // Handler saat gambar diambil
  const handleCapture = useCallback(async (gambarBase64: string) => {
    try {
      // 1. Set state loading
      setGambarTangkapan(gambarBase64);
      setSedangMemproses(true);

      // 2. Konversi base64 ke File
      const fileAsli = base64KeFile(gambarBase64);

      // 3. Kompresi gambar
      const fileKompresi = await kompresGambar(fileAsli, 0.8, 1024);

      // 4. Kirim ke backend API
      const hasil = await kirimPrediksi(fileKompresi);

      // 5. Simpan hasil ke state
      setHasilPrediksi(hasil);

      // 6. Tambah ke riwayat
      tambahRiwayat({
        id: generateId(),
        tanggal: new Date().toISOString(),
        gambar: gambarBase64,
        hasil,
      });

      // 7. Tampilkan notifikasi
      toast.success("Analisis Selesai!", {
        description: `Terdeteksi: ${hasil.namaIndonesia}`,
      });

      // 8. Navigasi ke halaman result
      router.push("/result");
      
    } catch (error) {
      toast.error("Gagal Menganalisis", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setSedangMemproses(false);
    }
  }, [/* dependencies */]);

  return (
    <div className="fixed inset-0 bg-slate-900">
      <Scanner onCapture={handleCapture} sedangMemproses={sedangMemproses} />
    </div>
  );
}
```

**Diagram Alur:**
```
[User klik Capture]
       ↓
Scanner.ambilGambar()
       ↓
onCapture(base64) → handleCapture()
       ↓
base64KeFile() → kompresGambar()
       ↓
kirimPrediksi() ─────► Backend Django
       ↓                    ↓
       ↓              PrediksiView.post()
       ↓                    ↓
       ↓              klasifikasiGambar()
       ↓                    ↓
       ←────────────── Response JSON
       ↓
setHasilPrediksi(hasil)
       ↓
tambahRiwayat()
       ↓
router.push("/result")
```

---

# Modul 8: Styling dengan Tailwind CSS

## 🎨 Apa itu Tailwind CSS?

Tailwind adalah **utility-first CSS framework**. Daripada menulis CSS custom, kita menggunakan class yang sudah ada.

### Perbandingan

```css
/* CSS Tradisional */
.button {
  background-color: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
}

.button:hover {
  background-color: #059669;
}
```

```tsx
// Tailwind CSS
<button className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-600">
  Tombol
</button>
```

### Class Tailwind yang Sering Digunakan

| Class | Fungsi | CSS Equivalent |
|-------|--------|----------------|
| `flex` | Display flex | `display: flex` |
| `items-center` | Align items center | `align-items: center` |
| `justify-between` | Space between | `justify-content: space-between` |
| `p-4` | Padding 1rem | `padding: 1rem` |
| `px-6` | Padding left/right | `padding-left: 1.5rem; padding-right: 1.5rem` |
| `my-4` | Margin top/bottom | `margin-top: 1rem; margin-bottom: 1rem` |
| `w-full` | Width 100% | `width: 100%` |
| `h-12` | Height 3rem | `height: 3rem` |
| `rounded-xl` | Border radius | `border-radius: 0.75rem` |
| `bg-emerald-500` | Background color | `background-color: #10b981` |
| `text-white` | Text color | `color: white` |
| `hover:bg-emerald-600` | Hover state | `:hover { background-color: #059669 }` |
| `transition-all` | Transition | `transition: all 150ms` |
| `shadow-lg` | Box shadow | Complex box-shadow |

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  grid 
  grid-cols-1      // 1 kolom di mobile
  md:grid-cols-2   // 2 kolom di tablet (>=768px)
  lg:grid-cols-4   // 4 kolom di desktop (>=1024px)
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Contoh Penggunaan di ChiliGuard

```tsx
// Tombol dengan gradient dan animasi
<Button
  className={cn(
    "group px-10 py-7 text-lg font-bold rounded-2xl",
    "bg-gradient-to-r from-emerald-500 to-emerald-600",
    "hover:from-emerald-600 hover:to-emerald-700",
    "text-white shadow-2xl shadow-emerald-500/30",
    "transition-all duration-300 hover:scale-105"
  )}
>
  <Scan className="w-6 h-6 mr-3" />
  Mulai Scan
  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
</Button>
```

**Penjelasan:**
- `cn()`: Fungsi untuk menggabungkan class conditionally
- `group`: Parent untuk group-hover
- `group-hover:translate-x-1`: Geser icon saat parent di-hover

---

## 🎓 Kesimpulan & Tips Belajar

### Ringkasan Teknologi

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| Frontend | Next.js 14 | React framework dengan routing |
| Language | TypeScript | JavaScript dengan tipe data |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | State management |
| Animation | Framer Motion | Animasi React |
| Backend | Django 5.0 | Python web framework |
| API | Django REST Framework | REST API |
| ML | TensorFlow/Keras | Machine learning |
| Database | SQLite | Database ringan |

### Tips Belajar

1. **Mulai dari kecil**: Pahami satu file dulu sebelum ke file lain
2. **Jalankan proyeknya**: `npm run dev` dan `python manage.py runserver`
3. **Eksperimen**: Ubah kode, lihat hasilnya
4. **Baca error message**: Error adalah guru terbaik
5. **Console.log/print**: Debug dengan mencetak nilai

### Perintah Penting

```bash
# Frontend (di folder frontend/)
npm install        # Install dependencies
npm run dev        # Jalankan development server (localhost:3000)
npm run build      # Build untuk production

# Backend (di folder backend/)
pip install -r requirements.txt  # Install dependencies
python manage.py runserver       # Jalankan server (localhost:8000)
python manage.py migrate         # Jalankan migrasi database
```

---

## 📚 Sumber Belajar Tambahan

1. **Django**: https://docs.djangoproject.com/
2. **Django REST Framework**: https://www.django-rest-framework.org/
3. **Next.js**: https://nextjs.org/docs
4. **TypeScript**: https://www.typescriptlang.org/docs/
5. **Tailwind CSS**: https://tailwindcss.com/docs
6. **React**: https://react.dev/
7. **Zustand**: https://zustand-demo.pmnd.rs/

---

> 💡 **Selamat belajar!** Jika ada pertanyaan, jangan ragu untuk bertanya. Pengembangan software adalah proses iteratif - tidak apa-apa untuk tidak paham semuanya sekaligus!
