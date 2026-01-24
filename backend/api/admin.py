"""
Admin configuration untuk aplikasi API ChiliGuard.
"""

from django.contrib import admin
from .models import Penyakit, RiwayatDeteksi, ProfilPengguna


@admin.register(Penyakit)
class PenyakitAdmin(admin.ModelAdmin):
    list_display = ['nama', 'nama_indonesia', 'created_at', 'updated_at']
    search_fields = ['nama', 'nama_indonesia', 'deskripsi']
    list_filter = ['created_at']
    ordering = ['nama']
    
    fieldsets = (
        ('Informasi Dasar', {
            'fields': ('nama', 'nama_indonesia', 'deskripsi')
        }),
        ('Gejala & Penanganan', {
            'fields': ('gejala', 'penanganan_organik', 'penanganan_kimia', 'pencegahan'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RiwayatDeteksi)
class RiwayatDeteksiAdmin(admin.ModelAdmin):
    list_display = ['user', 'nama_kelas', 'kepercayaan', 'status_sehat', 'created_at']
    search_fields = ['user__username', 'nama_kelas']
    list_filter = ['status_sehat', 'nama_kelas', 'created_at']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'penyakit')


@admin.register(ProfilPengguna)
class ProfilPenggunaAdmin(admin.ModelAdmin):
    list_display = ['user', 'nomor_telepon', 'created_at']
    search_fields = ['user__username', 'user__email', 'nomor_telepon']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
