"""
Model database untuk aplikasi ChiliGuard.

Mendefinisikan struktur data untuk penyakit tanaman cabai,
riwayat deteksi, dan profil pengguna.
"""

from django.db import models
from django.contrib.auth.models import User


class Penyakit(models.Model):
    """
    Model untuk menyimpan informasi penyakit tanaman cabai.
    """
    nama = models.CharField(max_length=100, unique=True, help_text="Nama penyakit dalam Bahasa Inggris")
    nama_indonesia = models.CharField(max_length=100, help_text="Nama penyakit dalam Bahasa Indonesia")
    deskripsi = models.TextField(help_text="Deskripsi singkat tentang penyakit")
    gejala = models.JSONField(default=list, help_text="Daftar gejala penyakit")
    penanganan_organik = models.JSONField(default=list, help_text="Cara penanganan organik")
    penanganan_kimia = models.JSONField(default=list, help_text="Cara penanganan kimia")
    pencegahan = models.JSONField(default=list, help_text="Langkah-langkah pencegahan")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Penyakit"
        verbose_name_plural = "Penyakit"
        ordering = ['nama']

    def __str__(self):
        return f"{self.nama_indonesia} ({self.nama})"


class RiwayatDeteksi(models.Model):
    """
    Model untuk menyimpan riwayat deteksi penyakit.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='riwayat_deteksi',
        help_text="Pengguna yang melakukan deteksi"
    )
    gambar = models.ImageField(
        upload_to='deteksi/%Y/%m/%d/',
        help_text="Gambar yang diupload untuk deteksi"
    )
    penyakit = models.ForeignKey(
        Penyakit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deteksi',
        help_text="Penyakit yang terdeteksi"
    )
    nama_kelas = models.CharField(max_length=100, help_text="Nama kelas hasil prediksi")
    kepercayaan = models.FloatField(help_text="Nilai kepercayaan prediksi (0-1)")
    status_sehat = models.BooleanField(default=False, help_text="Apakah tanaman sehat")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Riwayat Deteksi"
        verbose_name_plural = "Riwayat Deteksi"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.nama_kelas} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class ProfilPengguna(models.Model):
    """
    Model untuk menyimpan informasi tambahan pengguna.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profil'
    )
    foto_profil = models.ImageField(
        upload_to='profil/',
        null=True,
        blank=True,
        help_text="Foto profil pengguna"
    )
    nomor_telepon = models.CharField(max_length=20, blank=True)
    alamat = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil Pengguna"
        verbose_name_plural = "Profil Pengguna"

    def __str__(self):
        return f"Profil: {self.user.username}"
