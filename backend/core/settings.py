"""
Django settings untuk proyek ChiliGuard AI.

Konfigurasi Django untuk API backend dengan dukungan CORS
dan integrasi TensorFlow untuk deteksi penyakit tanaman cabai.
"""

from pathlib import Path
import os

# Path dasar proyek
BASE_DIR = Path(__file__).resolve().parent.parent

# Kunci rahasia untuk production harus diganti
SECRET_KEY = 'django-insecure-sc6gtxqgjdpwjk8+d#g3bc@+y9t^*m%2$511x$bk#c@poo&#ua'

# Mode debug - matikan di production
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# =============================================================================
# APLIKASI TERPASANG
# =============================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Aplikasi pihak ketiga
    'rest_framework',
    'corsheaders',
    
    # Aplikasi lokal
    'api',
]


# =============================================================================
# MIDDLEWARE
# =============================================================================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS harus di paling atas
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =============================================================================
# KONFIGURASI CORS
# =============================================================================

# Origin yang diizinkan untuk mengakses API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Izinkan credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Header yang diizinkan
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


# =============================================================================
# KONFIGURASI URL
# =============================================================================

ROOT_URLCONF = 'core.urls'


# =============================================================================
# KONFIGURASI TEMPLATE
# =============================================================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# =============================================================================
# DATABASE
# =============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# =============================================================================
# VALIDASI PASSWORD
# =============================================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# =============================================================================
# INTERNASIONALISASI
# =============================================================================

LANGUAGE_CODE = 'id'
TIME_ZONE = 'Asia/Jakarta'
USE_I18N = True
USE_TZ = True


# =============================================================================
# FILE STATIS DAN MEDIA
# =============================================================================

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'


# =============================================================================
# KONFIGURASI REST FRAMEWORK
# =============================================================================

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.JSONParser',
    ],
}


# =============================================================================
# KONFIGURASI MODEL ML
# =============================================================================

# Path ke file model .h5
MODEL_PATH = os.path.join(BASE_DIR, 'api', 'ml_models', 'chiligard_model_v1.h5')

# Kelas penyakit yang dapat dideteksi
# Label kelas sesuai urutan indeks model (0-8)
DAFTAR_KELAS_PENYAKIT = [
    'Anthracnose',       # 0: chilli_anthracnos
    'Damping Off',       # 1: chilli_damping_off
    'Healthy Fruit',     # 2: chilli_healthy_fruit
    'Healthy Leaf',      # 3: chilli_healthy_leaf
    'Leaf Curl',         # 4: chilli_leaf_curl_virus
    'Leaf Spot',         # 5: chilli_leaf_spot
    'Veinal Mottle',     # 6: chilli_veinal_mottle_virus
    'Whitefly',          # 7: chilli_whitefly
    'Yellowish',         # 8: chilli_yellowish
]

# Ukuran input gambar untuk model
UKURAN_GAMBAR_INPUT = (224, 224)


# =============================================================================
# DEFAULT AUTO FIELD
# =============================================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
