"""
URL routing untuk aplikasi API.

Mendefinisikan endpoint-endpoint yang tersedia di API ChiliGuard.
"""

from django.urls import path
from .views import (
    # Authentication
    RegisterView, LoginView, LogoutView, ProfileView,
    # Detection
    PrediksiView, RiwayatDeteksiView, DetailRiwayatView,
    # Info
    KesehatanView, DaftarKelasView, DaftarPenyakitView, DetailPenyakitView
)

app_name = 'api'

urlpatterns = [
    # ==========================================================================
    # AUTHENTICATION ENDPOINTS
    # ==========================================================================
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    
    # ==========================================================================
    # DETECTION ENDPOINTS
    # ==========================================================================
    path('predict/', PrediksiView.as_view(), name='prediksi'),
    path('history/', RiwayatDeteksiView.as_view(), name='riwayat'),
    path('history/<int:pk>/', DetailRiwayatView.as_view(), name='detail-riwayat'),
    
    # ==========================================================================
    # INFO ENDPOINTS
    # ==========================================================================
    path('health/', KesehatanView.as_view(), name='kesehatan'),
    path('classes/', DaftarKelasView.as_view(), name='daftar-kelas'),
    path('diseases/', DaftarPenyakitView.as_view(), name='daftar-penyakit'),
    path('diseases/<int:pk>/', DetailPenyakitView.as_view(), name='detail-penyakit'),
]
