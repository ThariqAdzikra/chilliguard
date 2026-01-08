"""
URL routing untuk aplikasi API.

Mendefinisikan endpoint-endpoint yang tersedia di API ChiliGuard.
"""

from django.urls import path
from .views import PrediksiView, KesehatanView, DaftarKelasView

app_name = 'api'

urlpatterns = [
    # Endpoint prediksi penyakit
    path('predict/', PrediksiView.as_view(), name='prediksi'),
    
    # Endpoint health check
    path('health/', KesehatanView.as_view(), name='kesehatan'),
    
    # Endpoint daftar kelas penyakit
    path('classes/', DaftarKelasView.as_view(), name='daftar-kelas'),
]
