"""
Utilitas untuk inferensi model AI ChiliGuard.

Modul ini berisi fungsi-fungsi untuk memuat model TensorFlow
dan melakukan klasifikasi gambar daun cabai.
"""

import os
import numpy as np
from PIL import Image
from io import BytesIO
from django.conf import settings

# Variabel global untuk menyimpan model (dimuat sekali saat startup)
_modelTerlatih = None


def muatModel():
    """
    Memuat model TensorFlow dari file .h5.
    Model hanya dimuat sekali dan disimpan dalam variabel global.
    
    Returns:
        Model TensorFlow yang sudah dimuat, atau None jika file tidak ditemukan.
    """
    global _modelTerlatih
    
    if _modelTerlatih is not None:
        return _modelTerlatih
    
    jalurModel = settings.MODEL_PATH
    
    if not os.path.exists(jalurModel):
        print(f"[PERINGATAN] File model tidak ditemukan di: {jalurModel}")
        print("[INFO] Letakkan file model.h5 di folder api/ml_models/")
        return None
    
    # Metode 1: Coba load langsung dengan compile=False
    try:
        from tensorflow import keras
        _modelTerlatih = keras.models.load_model(jalurModel, compile=False)
        print(f"[SUKSES] Model berhasil dimuat dari: {jalurModel}")
        return _modelTerlatih
    except Exception as kesalahan:
        print(f"[INFO] Load standar gagal, mencoba rebuild arsitektur: {kesalahan}")
    
    # Metode 2: Rebuild arsitektur MobileNetV2 sesuai model asli dan load weights
    try:
        import tensorflow as tf
        from tensorflow import keras
        
        # Dapatkan jumlah kelas dari settings
        num_kelas = len(settings.DAFTAR_KELAS_PENYAKIT)
        ukuran_input = settings.UKURAN_GAMBAR_INPUT
        
        # Rebuild arsitektur: MobileNetV2 + Custom Head (sesuai model asli)
        base_model = keras.applications.MobileNetV2(
            include_top=False,
            weights=None,  # Weights akan diload dari h5
            input_shape=(ukuran_input[0], ukuran_input[1], 3)
        )
        
        # Build model dengan arsitektur yang sama persis dengan model asli
        model = keras.Sequential([
            keras.layers.InputLayer(input_shape=(ukuran_input[0], ukuran_input[1], 3)),
            base_model,
            keras.layers.GlobalAveragePooling2D(),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(256, activation='relu'),  # 256 units sesuai model asli
            keras.layers.Dense(num_kelas, activation='softmax')  # 9 classes
        ])
        
        # Load weights dari file h5
        try:
            model.load_weights(jalurModel)
            print(f"[SUKSES] Model weights berhasil dimuat dari: {jalurModel}")
            _modelTerlatih = model
            return _modelTerlatih
        except Exception as e:
            print(f"[ERROR] Gagal load weights: {e}")
            print("[INFO] Model tidak dapat dimuat dengan benar. Coba export ulang model dengan TensorFlow versi yang sama.")
            return None
            
    except Exception as kesalahan2:
        print(f"[ERROR] Gagal rebuild model: {kesalahan2}")
        return None


def prosesGambar(fileGambar):
    """
    Memproses gambar untuk input ke model.
    
    Args:
        fileGambar: File gambar yang diupload (InMemoryUploadedFile).
        
    Returns:
        numpy.ndarray: Array gambar yang sudah diproses (1, 224, 224, 3).
    """
    # Baca gambar dari file upload
    kontenGambar = fileGambar.read()
    gambar = Image.open(BytesIO(kontenGambar))
    
    # Konversi ke RGB jika perlu (handle RGBA, grayscale, dll)
    if gambar.mode != 'RGB':
        gambar = gambar.convert('RGB')
    
    # Resize ke ukuran yang dibutuhkan model
    ukuranInput = settings.UKURAN_GAMBAR_INPUT
    gambar = gambar.resize(ukuranInput, Image.Resampling.LANCZOS)
    
    # Konversi ke array numpy dan normalisasi
    arrayGambar = np.array(gambar, dtype=np.float32)
    arrayGambar = arrayGambar / 255.0  # Normalisasi ke range 0-1
    
    # Tambahkan dimensi batch
    arrayGambar = np.expand_dims(arrayGambar, axis=0)
    
    return arrayGambar


def klasifikasiGambar(fileGambar):
    """
    Melakukan klasifikasi gambar daun cabai.
    
    Args:
        fileGambar: File gambar yang diupload.
        
    Returns:
        dict: Hasil klasifikasi dengan format:
            {
                'kelas': nama kelas penyakit,
                'kepercayaan': nilai kepercayaan (0-1),
                'semuaPrediksi': list semua prediksi dengan confidence
            }
    """
    # Muat model
    model = muatModel()
    
    if model is None:
        # Mode demo: kembalikan hasil dummy jika model belum tersedia
        return {
            'sukses': True,
            'kelas': 'Healthy Leaf',
            'kepercayaan': 0.95,
            'semuaPrediksi': [
                {'kelas': kelas, 'kepercayaan': 0.0}
                for kelas in settings.DAFTAR_KELAS_PENYAKIT
            ],
            'pesan': 'Mode demo - model belum dimuat'
        }
    
    try:
        # Proses gambar
        gambarInput = prosesGambar(fileGambar)
        
        # Lakukan prediksi
        hasilPrediksi = model.predict(gambarInput, verbose=0)
        
        # Ambil probabilitas untuk setiap kelas
        probabilitas = hasilPrediksi[0]
        
        # Cari indeks dengan probabilitas tertinggi
        indeksTertinggi = np.argmax(probabilitas)
        nilaiKepercayaan = float(probabilitas[indeksTertinggi])
        kelasTedeteksi = settings.DAFTAR_KELAS_PENYAKIT[indeksTertinggi]
        
        # Buat list semua prediksi
        semuaPrediksi = [
            {
                'kelas': settings.DAFTAR_KELAS_PENYAKIT[i],
                'kepercayaan': float(probabilitas[i])
            }
            for i in range(len(settings.DAFTAR_KELAS_PENYAKIT))
        ]
        
        # Urutkan berdasarkan kepercayaan (tertinggi dulu)
        semuaPrediksi.sort(key=lambda x: x['kepercayaan'], reverse=True)
        
        return {
            'sukses': True,
            'kelas': kelasTedeteksi,
            'kepercayaan': nilaiKepercayaan,
            'semuaPrediksi': semuaPrediksi,
            'pesan': 'Klasifikasi berhasil'
        }
        
    except Exception as kesalahan:
        return {
            'sukses': False,
            'kelas': None,
            'kepercayaan': 0.0,
            'semuaPrediksi': [],
            'pesan': f'Kesalahan saat klasifikasi: {str(kesalahan)}'
        }


def dapatkanInfoPenyakit(namaKelas):
    """
    Mendapatkan informasi detail tentang penyakit.
    
    Args:
        namaKelas: Nama kelas penyakit.
        
    Returns:
        dict: Informasi penyakit termasuk deskripsi dan penanganan.
    """
    infoPenyakit = {
        'Anthracnose': {
            'namaIndonesia': 'Antraknosa',
            'deskripsi': 'Penyakit jamur yang menyebabkan bercak hitam cekung pada buah cabai.',
            'gejala': [
                'Bercak hitam atau coklat pada buah',
                'Bercak meluas dan cekung',
                'Buah mengkerut dan busuk',
            ],
            'penangananOrganik': [
                'Semprotkan larutan bawang putih (500g bawang putih + 1L air)',
                'Gunakan ekstrak daun pepaya',
                'Aplikasikan Trichoderma sp.',
            ],
            'penangananKimia': [
                'Fungisida berbahan aktif Mankozeb',
                'Fungisida berbahan aktif Propineb',
                'Semprotkan setiap 7-10 hari saat musim hujan',
            ],
            'pencegahan': [
                'Gunakan benih yang bebas penyakit',
                'Rotasi tanaman minimal 2 tahun',
                'Hindari kelembaban berlebih',
            ],
        },
        'Damping Off': {
            'namaIndonesia': 'Rebah Kecambah',
            'deskripsi': 'Penyakit yang menyerang bibit muda menyebabkan rebah dan mati.',
            'gejala': [
                'Batang bibit mengecil di pangkal',
                'Bibit rebah dan layu',
                'Akar membusuk',
            ],
            'penangananOrganik': [
                'Taburkan abu sekam pada media semai',
                'Aplikasikan Trichoderma harzianum',
                'Gunakan kompos yang sudah matang',
            ],
            'penangananKimia': [
                'Fungisida berbahan aktif Metalaksil',
                'Rendam benih dengan fungisida sebelum tanam',
            ],
            'pencegahan': [
                'Sterilisasi media semai',
                'Atur jarak tanam yang baik',
                'Hindari penyiraman berlebihan',
            ],
        },
        'Healthy Fruit': {
            'namaIndonesia': 'Buah Sehat',
            'deskripsi': 'Buah cabai dalam kondisi sehat tanpa gejala penyakit.',
            'gejala': [],
            'penangananOrganik': [],
            'penangananKimia': [],
            'pencegahan': [
                'Lanjutkan perawatan rutin',
                'Jaga kebersihan lahan',
                'Pemupukan berimbang',
            ],
        },
        'Healthy Leaf': {
            'namaIndonesia': 'Daun Sehat',
            'deskripsi': 'Daun cabai dalam kondisi sehat tanpa gejala penyakit.',
            'gejala': [],
            'penangananOrganik': [],
            'penangananKimia': [],
            'pencegahan': [
                'Lanjutkan perawatan rutin',
                'Jaga kebersihan lahan',
                'Pemupukan berimbang',
            ],
        },
        'Leaf Curl': {
            'namaIndonesia': 'Keriting Daun',
            'deskripsi': 'Penyakit virus yang menyebabkan daun menggulung dan keriting.',
            'gejala': [
                'Daun menggulung ke atas',
                'Daun menebal dan kaku',
                'Pertumbuhan terhambat',
                'Tanaman kerdil',
            ],
            'penangananOrganik': [
                'Cabut dan musnahkan tanaman terinfeksi',
                'Semprotkan pestisida nabati untuk kutu pembawa virus',
                'Pasang perangkap kuning',
            ],
            'penangananKimia': [
                'Insektisida untuk mengendalikan kutu daun',
                'Tidak ada obat untuk virus, fokus pada pencegahan',
            ],
            'pencegahan': [
                'Gunakan varietas tahan virus',
                'Pasang mulsa plastik perak',
                'Kendalikan gulma',
            ],
        },
        'Leaf Spot': {
            'namaIndonesia': 'Bercak Daun',
            'deskripsi': 'Penyakit jamur yang menyebabkan bercak pada daun.',
            'gejala': [
                'Bercak coklat atau hitam pada daun',
                'Bercak meluas dan berlubang',
                'Daun menguning dan rontok',
            ],
            'penangananOrganik': [
                'Semprotkan larutan air kapur',
                'Aplikasikan fungisida hayati',
                'Pangkas daun terinfeksi',
            ],
            'penangananKimia': [
                'Fungisida berbahan aktif Klorotalonil',
                'Fungisida berbahan aktif Tembaga hidroksida',
            ],
            'pencegahan': [
                'Hindari penyiraman dari atas',
                'Jaga sirkulasi udara',
                'Rotasi tanaman',
            ],
        },
        'Veinal Mottle': {
            'namaIndonesia': 'Belang Urat Daun',
            'deskripsi': 'Penyakit virus yang menyebabkan belang pada urat daun.',
            'gejala': [
                'Pola belang kuning sepanjang urat daun',
                'Daun mengerut',
                'Buah kecil dan cacat',
            ],
            'penangananOrganik': [
                'Musnahkan tanaman terinfeksi',
                'Kendalikan kutu daun secara alami',
                'Tanam tanaman pengusir serangga',
            ],
            'penangananKimia': [
                'Insektisida untuk kutu daun pembawa virus',
            ],
            'pencegahan': [
                'Gunakan benih bebas virus',
                'Pasang barrier tanaman',
                'Sanitasi lahan secara rutin',
            ],
        },
        'Whitefly': {
            'namaIndonesia': 'Kutu Kebul',
            'deskripsi': 'Serangan hama kutu kebul yang mengisap cairan tanaman.',
            'gejala': [
                'Kutu putih kecil di bawah daun',
                'Daun menguning',
                'Terdapat embun jelaga',
                'Tanaman layu',
            ],
            'penangananOrganik': [
                'Semprotkan minyak neem',
                'Gunakan sabun insektisida',
                'Pasang perangkap kuning berperekat',
            ],
            'penangananKimia': [
                'Insektisida berbahan aktif Imidakloprid',
                'Insektisida berbahan aktif Abamektin',
            ],
            'pencegahan': [
                'Pasang mulsa plastik perak',
                'Tanam refugia untuk predator alami',
                'Rotasi insektisida untuk mencegah resistensi',
            ],
        },
        'Yellowish': {
            'namaIndonesia': 'Menguning',
            'deskripsi': 'Kondisi daun menguning yang bisa disebabkan berbagai faktor.',
            'gejala': [
                'Daun berubah kuning',
                'Daun layu',
                'Pertumbuhan lambat',
            ],
            'penangananOrganik': [
                'Tambahkan pupuk organik kaya nitrogen',
                'Perbaiki drainase tanah',
                'Cek pH tanah dan sesuaikan',
            ],
            'penangananKimia': [
                'Pupuk daun NPK',
                'Pupuk mengandung zat besi jika defisiensi Fe',
            ],
            'pencegahan': [
                'Pemupukan berimbang',
                'Pengairan yang tepat',
                'Drainase yang baik',
            ],
        },
    }
    
    return infoPenyakit.get(namaKelas, {
        'namaIndonesia': namaKelas,
        'deskripsi': 'Informasi tidak tersedia.',
        'gejala': [],
        'penangananOrganik': [],
        'penangananKimia': [],
        'pencegahan': [],
    })
