"""
Views untuk API ChiliGuard.

Endpoint API untuk klasifikasi gambar daun cabai
menggunakan model machine learning.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .utils import klasifikasiGambar, dapatkanInfoPenyakit


class PrediksiView(APIView):
    """
    Endpoint untuk melakukan prediksi penyakit dari gambar daun cabai.
    
    Menerima gambar via POST dan mengembalikan hasil klasifikasi
    beserta informasi penanganan penyakit.
    """
    
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        """
        Handle POST request untuk prediksi.
        
        Request Body:
            - image: File gambar (required)
            
        Response:
            - sukses: Boolean status
            - kelas: Nama kelas penyakit terdeteksi
            - namaIndonesia: Nama penyakit dalam Bahasa Indonesia
            - kepercayaan: Nilai confidence (0-1)
            - deskripsi: Deskripsi penyakit
            - gejala: List gejala penyakit
            - penangananOrganik: List penanganan organik
            - penangananKimia: List penanganan kimia
            - pencegahan: List langkah pencegahan
        """
        # Validasi file gambar
        fileGambar = request.FILES.get('image')
        
        if not fileGambar:
            return Response(
                {
                    'sukses': False,
                    'pesan': 'File gambar tidak ditemukan. Kirim file dengan key "image".'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validasi tipe file
        tipeFileValid = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        if fileGambar.content_type not in tipeFileValid:
            return Response(
                {
                    'sukses': False,
                    'pesan': f'Tipe file tidak valid. Gunakan: {", ".join(tipeFileValid)}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validasi ukuran file (max 10MB)
        ukuranMaksimal = 10 * 1024 * 1024  # 10MB
        if fileGambar.size > ukuranMaksimal:
            return Response(
                {
                    'sukses': False,
                    'pesan': 'Ukuran file terlalu besar. Maksimal 10MB.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Lakukan klasifikasi
        hasilKlasifikasi = klasifikasiGambar(fileGambar)
        
        if not hasilKlasifikasi['sukses']:
            return Response(
                {
                    'sukses': False,
                    'pesan': hasilKlasifikasi['pesan']
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Dapatkan informasi penyakit
        kelasTedeteksi = hasilKlasifikasi['kelas']
        infoPenyakit = dapatkanInfoPenyakit(kelasTedeteksi)
        
        # Tentukan status kesehatan
        statusSehat = kelasTedeteksi in ['Healthy Fruit', 'Healthy Leaf']
        
        # Susun response
        dataResponse = {
            'sukses': True,
            'kelas': kelasTedeteksi,
            'namaIndonesia': infoPenyakit.get('namaIndonesia', kelasTedeteksi),
            'kepercayaan': round(hasilKlasifikasi['kepercayaan'], 4),
            'persentaseKepercayaan': round(hasilKlasifikasi['kepercayaan'] * 100, 2),
            'statusSehat': statusSehat,
            'deskripsi': infoPenyakit.get('deskripsi', ''),
            'gejala': infoPenyakit.get('gejala', []),
            'penangananOrganik': infoPenyakit.get('penangananOrganik', []),
            'penangananKimia': infoPenyakit.get('penangananKimia', []),
            'pencegahan': infoPenyakit.get('pencegahan', []),
            'semuaPrediksi': hasilKlasifikasi.get('semuaPrediksi', [])[:5],  # Top 5 prediksi
        }
        
        return Response(dataResponse, status=status.HTTP_200_OK)


class KesehatanView(APIView):
    """
    Endpoint untuk memeriksa status kesehatan API.
    """
    
    def get(self, request, *args, **kwargs):
        """
        Handle GET request untuk health check.
        """
        return Response(
            {
                'status': 'aktif',
                'pesan': 'ChiliGuard API berjalan dengan baik',
                'versi': '1.0.0',
            },
            status=status.HTTP_200_OK
        )


class DaftarKelasView(APIView):
    """
    Endpoint untuk mendapatkan daftar semua kelas penyakit yang dapat dideteksi.
    """
    
    def get(self, request, *args, **kwargs):
        """
        Handle GET request untuk list kelas.
        """
        from django.conf import settings
        
        daftarKelas = []
        for kelas in settings.DAFTAR_KELAS_PENYAKIT:
            infoPenyakit = dapatkanInfoPenyakit(kelas)
            daftarKelas.append({
                'kelas': kelas,
                'namaIndonesia': infoPenyakit.get('namaIndonesia', kelas),
                'deskripsi': infoPenyakit.get('deskripsi', ''),
            })
        
        return Response(
            {
                'sukses': True,
                'jumlahKelas': len(daftarKelas),
                'daftarKelas': daftarKelas,
            },
            status=status.HTTP_200_OK
        )
