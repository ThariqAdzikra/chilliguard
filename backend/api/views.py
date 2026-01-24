"""
Views untuk API ChiliGuard.

Endpoint API untuk klasifikasi gambar daun cabai,
autentikasi pengguna, dan riwayat deteksi.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.files.base import ContentFile

from .utils import klasifikasiGambar, dapatkanInfoPenyakit
from .models import Penyakit, RiwayatDeteksi, ProfilPengguna
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    RiwayatDeteksiSerializer, PenyakitSerializer
)


# =============================================================================
# AUTHENTICATION VIEWS
# =============================================================================

class RegisterView(APIView):
    """
    Endpoint untuk registrasi pengguna baru.
    
    POST /api/auth/register/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'sukses': True,
                'pesan': 'Registrasi berhasil!',
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'sukses': False,
            'pesan': 'Registrasi gagal.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Endpoint untuk login pengguna.
    
    POST /api/auth/login/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'sukses': True,
                    'pesan': 'Login berhasil!',
                    'token': token.key,
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'sukses': False,
                'pesan': 'Username atau password salah.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'sukses': False,
            'pesan': 'Data tidak valid.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Endpoint untuk logout pengguna.
    
    POST /api/auth/logout/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        request.user.auth_token.delete()
        return Response({
            'sukses': True,
            'pesan': 'Logout berhasil!'
        }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """
    Endpoint untuk melihat dan mengupdate profil pengguna.
    
    GET/PUT /api/auth/profile/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'sukses': True,
            'user': UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = request.user
        profil = user.profil
        
        # Update user fields
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            user.email = request.data['email']
        user.save()
        
        # Update profile fields
        if 'nomor_telepon' in request.data:
            profil.nomor_telepon = request.data['nomor_telepon']
        if 'alamat' in request.data:
            profil.alamat = request.data['alamat']
        if 'foto_profil' in request.FILES:
            profil.foto_profil = request.FILES['foto_profil']
        profil.save()
        
        return Response({
            'sukses': True,
            'pesan': 'Profil berhasil diupdate!',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


# =============================================================================
# DETECTION VIEWS
# =============================================================================

class PrediksiView(APIView):
    """
    Endpoint untuk melakukan prediksi penyakit dari gambar daun cabai.
    
    Menerima gambar via POST dan mengembalikan hasil klasifikasi
    beserta informasi penanganan penyakit.
    
    Jika user login, hasil akan disimpan ke riwayat.
    """
    
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
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
        
        # Coba ambil dari database, fallback ke utils jika tidak ada
        try:
            penyakitDB = Penyakit.objects.get(nama=kelasTedeteksi)
            infoPenyakit = {
                'namaIndonesia': penyakitDB.nama_indonesia,
                'deskripsi': penyakitDB.deskripsi,
                'gejala': penyakitDB.gejala,
                'penangananOrganik': penyakitDB.penanganan_organik,
                'penangananKimia': penyakitDB.penanganan_kimia,
                'pencegahan': penyakitDB.pencegahan,
            }
        except Penyakit.DoesNotExist:
            infoPenyakit = dapatkanInfoPenyakit(kelasTedeteksi)
            penyakitDB = None
        
        # Tentukan status kesehatan
        statusSehat = kelasTedeteksi in ['Healthy Fruit', 'Healthy Leaf']
        
        # Simpan ke riwayat jika user login
        if request.user.is_authenticated:
            # Reset file pointer
            fileGambar.seek(0)
            
            riwayat = RiwayatDeteksi.objects.create(
                user=request.user,
                gambar=fileGambar,
                penyakit=penyakitDB,
                nama_kelas=kelasTedeteksi,
                kepercayaan=hasilKlasifikasi['kepercayaan'],
                status_sehat=statusSehat
            )
        
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
            'semuaPrediksi': hasilKlasifikasi.get('semuaPrediksi', [])[:5],
            'tersimpan': request.user.is_authenticated,
        }
        
        return Response(dataResponse, status=status.HTTP_200_OK)


class RiwayatDeteksiView(APIView):
    """
    Endpoint untuk melihat riwayat deteksi pengguna.
    
    GET /api/history/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        riwayat = RiwayatDeteksi.objects.filter(user=request.user)[:50]
        serializer = RiwayatDeteksiSerializer(riwayat, many=True)
        return Response({
            'sukses': True,
            'jumlah': riwayat.count(),
            'riwayat': serializer.data
        }, status=status.HTTP_200_OK)


class DetailRiwayatView(APIView):
    """
    Endpoint untuk melihat detail satu riwayat deteksi.
    
    GET /api/history/<id>/
    DELETE /api/history/<id>/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            riwayat = RiwayatDeteksi.objects.get(pk=pk, user=request.user)
            serializer = RiwayatDeteksiSerializer(riwayat)
            return Response({
                'sukses': True,
                'riwayat': serializer.data
            }, status=status.HTTP_200_OK)
        except RiwayatDeteksi.DoesNotExist:
            return Response({
                'sukses': False,
                'pesan': 'Riwayat tidak ditemukan.'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            riwayat = RiwayatDeteksi.objects.get(pk=pk, user=request.user)
            riwayat.delete()
            return Response({
                'sukses': True,
                'pesan': 'Riwayat berhasil dihapus.'
            }, status=status.HTTP_200_OK)
        except RiwayatDeteksi.DoesNotExist:
            return Response({
                'sukses': False,
                'pesan': 'Riwayat tidak ditemukan.'
            }, status=status.HTTP_404_NOT_FOUND)


# =============================================================================
# INFO VIEWS
# =============================================================================

class KesehatanView(APIView):
    """
    Endpoint untuk memeriksa status kesehatan API.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
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
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Coba ambil dari database dulu
        penyakitDB = Penyakit.objects.all()
        
        if penyakitDB.exists():
            daftarKelas = PenyakitSerializer(penyakitDB, many=True).data
        else:
            # Fallback ke settings jika database kosong
            from django.conf import settings
            daftarKelas = []
            for kelas in settings.DAFTAR_KELAS_PENYAKIT:
                infoPenyakit = dapatkanInfoPenyakit(kelas)
                daftarKelas.append({
                    'nama': kelas,
                    'nama_indonesia': infoPenyakit.get('namaIndonesia', kelas),
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


class DaftarPenyakitView(APIView):
    """
    Endpoint untuk mendapatkan detail semua penyakit dari database.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        penyakit = Penyakit.objects.all()
        serializer = PenyakitSerializer(penyakit, many=True)
        return Response({
            'sukses': True,
            'jumlah': penyakit.count(),
            'penyakit': serializer.data
        }, status=status.HTTP_200_OK)


class DetailPenyakitView(APIView):
    """
    Endpoint untuk mendapatkan detail satu penyakit.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            penyakit = Penyakit.objects.get(pk=pk)
            serializer = PenyakitSerializer(penyakit)
            return Response({
                'sukses': True,
                'penyakit': serializer.data
            }, status=status.HTTP_200_OK)
        except Penyakit.DoesNotExist:
            return Response({
                'sukses': False,
                'pesan': 'Penyakit tidak ditemukan.'
            }, status=status.HTTP_404_NOT_FOUND)
