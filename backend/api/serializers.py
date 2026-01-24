"""
Serializers untuk API ChiliGuard.

Mengkonversi model Django ke format JSON dan sebaliknya.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Penyakit, RiwayatDeteksi, ProfilPengguna


class PenyakitSerializer(serializers.ModelSerializer):
    """Serializer untuk model Penyakit."""
    
    class Meta:
        model = Penyakit
        fields = [
            'id', 'nama', 'nama_indonesia', 'deskripsi',
            'gejala', 'penanganan_organik', 'penanganan_kimia', 'pencegahan'
        ]


class RiwayatDeteksiSerializer(serializers.ModelSerializer):
    """Serializer untuk model RiwayatDeteksi."""
    penyakit_detail = PenyakitSerializer(source='penyakit', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = RiwayatDeteksi
        fields = [
            'id', 'username', 'gambar', 'nama_kelas', 
            'kepercayaan', 'status_sehat', 'penyakit_detail', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ProfilPenggunaSerializer(serializers.ModelSerializer):
    """Serializer untuk model ProfilPengguna."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ProfilPengguna
        fields = [
            'id', 'username', 'email', 'foto_profil',
            'nomor_telepon', 'alamat', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer untuk registrasi pengguna baru."""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password tidak cocok."
            })
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": "Email sudah terdaftar."
            })
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Buat profil pengguna otomatis
        ProfilPengguna.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer untuk login pengguna."""
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True, 
        write_only=True,
        style={'input_type': 'password'}
    )


class UserSerializer(serializers.ModelSerializer):
    """Serializer untuk data pengguna."""
    profil = ProfilPenggunaSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profil']
        read_only_fields = ['id']
