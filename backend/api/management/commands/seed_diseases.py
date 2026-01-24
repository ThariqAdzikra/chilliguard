"""
Management command untuk mengisi data penyakit ke database.

Jalankan dengan: python manage.py seed_diseases
"""

from django.core.management.base import BaseCommand
from api.models import Penyakit


class Command(BaseCommand):
    help = 'Mengisi database dengan data penyakit tanaman cabai'

    def handle(self, *args, **options):
        self.stdout.write('Memulai seed data penyakit...')
        
        data_penyakit = [
            {
                'nama': 'Anthracnose',
                'nama_indonesia': 'Antraknosa',
                'deskripsi': 'Penyakit jamur yang menyebabkan bercak hitam cekung pada buah cabai.',
                'gejala': [
                    'Bercak hitam atau coklat pada buah',
                    'Bercak meluas dan cekung',
                    'Buah mengkerut dan busuk',
                ],
                'penanganan_organik': [
                    'Semprotkan larutan bawang putih (500g bawang putih + 1L air)',
                    'Gunakan ekstrak daun pepaya',
                    'Aplikasikan Trichoderma sp.',
                ],
                'penanganan_kimia': [
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
            {
                'nama': 'Damping Off',
                'nama_indonesia': 'Rebah Kecambah',
                'deskripsi': 'Penyakit yang menyerang bibit muda menyebabkan rebah dan mati.',
                'gejala': [
                    'Batang bibit mengecil di pangkal',
                    'Bibit rebah dan layu',
                    'Akar membusuk',
                ],
                'penanganan_organik': [
                    'Taburkan abu sekam pada media semai',
                    'Aplikasikan Trichoderma harzianum',
                    'Gunakan kompos yang sudah matang',
                ],
                'penanganan_kimia': [
                    'Fungisida berbahan aktif Metalaksil',
                    'Rendam benih dengan fungisida sebelum tanam',
                ],
                'pencegahan': [
                    'Sterilisasi media semai',
                    'Atur jarak tanam yang baik',
                    'Hindari penyiraman berlebihan',
                ],
            },
            {
                'nama': 'Healthy Fruit',
                'nama_indonesia': 'Buah Sehat',
                'deskripsi': 'Buah cabai dalam kondisi sehat tanpa gejala penyakit.',
                'gejala': [],
                'penanganan_organik': [],
                'penanganan_kimia': [],
                'pencegahan': [
                    'Lanjutkan perawatan rutin',
                    'Jaga kebersihan lahan',
                    'Pemupukan berimbang',
                ],
            },
            {
                'nama': 'Healthy Leaf',
                'nama_indonesia': 'Daun Sehat',
                'deskripsi': 'Daun cabai dalam kondisi sehat tanpa gejala penyakit.',
                'gejala': [],
                'penanganan_organik': [],
                'penanganan_kimia': [],
                'pencegahan': [
                    'Lanjutkan perawatan rutin',
                    'Jaga kebersihan lahan',
                    'Pemupukan berimbang',
                ],
            },
            {
                'nama': 'Leaf Curl',
                'nama_indonesia': 'Keriting Daun',
                'deskripsi': 'Penyakit virus yang menyebabkan daun menggulung dan keriting.',
                'gejala': [
                    'Daun menggulung ke atas',
                    'Daun menebal dan kaku',
                    'Pertumbuhan terhambat',
                    'Tanaman kerdil',
                ],
                'penanganan_organik': [
                    'Cabut dan musnahkan tanaman terinfeksi',
                    'Semprotkan pestisida nabati untuk kutu pembawa virus',
                    'Pasang perangkap kuning',
                ],
                'penanganan_kimia': [
                    'Insektisida untuk mengendalikan kutu daun',
                    'Tidak ada obat untuk virus, fokus pada pencegahan',
                ],
                'pencegahan': [
                    'Gunakan varietas tahan virus',
                    'Pasang mulsa plastik perak',
                    'Kendalikan gulma',
                ],
            },
            {
                'nama': 'Leaf Spot',
                'nama_indonesia': 'Bercak Daun',
                'deskripsi': 'Penyakit jamur yang menyebabkan bercak pada daun.',
                'gejala': [
                    'Bercak coklat atau hitam pada daun',
                    'Bercak meluas dan berlubang',
                    'Daun menguning dan rontok',
                ],
                'penanganan_organik': [
                    'Semprotkan larutan air kapur',
                    'Aplikasikan fungisida hayati',
                    'Pangkas daun terinfeksi',
                ],
                'penanganan_kimia': [
                    'Fungisida berbahan aktif Klorotalonil',
                    'Fungisida berbahan aktif Tembaga hidroksida',
                ],
                'pencegahan': [
                    'Hindari penyiraman dari atas',
                    'Jaga sirkulasi udara',
                    'Rotasi tanaman',
                ],
            },
            {
                'nama': 'Veinal Mottle',
                'nama_indonesia': 'Belang Urat Daun',
                'deskripsi': 'Penyakit virus yang menyebabkan belang pada urat daun.',
                'gejala': [
                    'Pola belang kuning sepanjang urat daun',
                    'Daun mengerut',
                    'Buah kecil dan cacat',
                ],
                'penanganan_organik': [
                    'Musnahkan tanaman terinfeksi',
                    'Kendalikan kutu daun secara alami',
                    'Tanam tanaman pengusir serangga',
                ],
                'penanganan_kimia': [
                    'Insektisida untuk kutu daun pembawa virus',
                ],
                'pencegahan': [
                    'Gunakan benih bebas virus',
                    'Pasang barrier tanaman',
                    'Sanitasi lahan secara rutin',
                ],
            },
            {
                'nama': 'Whitefly',
                'nama_indonesia': 'Kutu Kebul',
                'deskripsi': 'Serangan hama kutu kebul yang mengisap cairan tanaman.',
                'gejala': [
                    'Kutu putih kecil di bawah daun',
                    'Daun menguning',
                    'Terdapat embun jelaga',
                    'Tanaman layu',
                ],
                'penanganan_organik': [
                    'Semprotkan minyak neem',
                    'Gunakan sabun insektisida',
                    'Pasang perangkap kuning berperekat',
                ],
                'penanganan_kimia': [
                    'Insektisida berbahan aktif Imidakloprid',
                    'Insektisida berbahan aktif Abamektin',
                ],
                'pencegahan': [
                    'Pasang mulsa plastik perak',
                    'Tanam refugia untuk predator alami',
                    'Rotasi insektisida untuk mencegah resistensi',
                ],
            },
            {
                'nama': 'Yellowish',
                'nama_indonesia': 'Menguning',
                'deskripsi': 'Kondisi daun menguning yang bisa disebabkan berbagai faktor.',
                'gejala': [
                    'Daun berubah kuning',
                    'Daun layu',
                    'Pertumbuhan lambat',
                ],
                'penanganan_organik': [
                    'Tambahkan pupuk organik kaya nitrogen',
                    'Perbaiki drainase tanah',
                    'Cek pH tanah dan sesuaikan',
                ],
                'penanganan_kimia': [
                    'Pupuk daun NPK',
                    'Pupuk mengandung zat besi jika defisiensi Fe',
                ],
                'pencegahan': [
                    'Pemupukan berimbang',
                    'Pengairan yang tepat',
                    'Drainase yang baik',
                ],
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for data in data_penyakit:
            penyakit, created = Penyakit.objects.update_or_create(
                nama=data['nama'],
                defaults={
                    'nama_indonesia': data['nama_indonesia'],
                    'deskripsi': data['deskripsi'],
                    'gejala': data['gejala'],
                    'penanganan_organik': data['penanganan_organik'],
                    'penanganan_kimia': data['penanganan_kimia'],
                    'pencegahan': data['pencegahan'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Dibuat: {penyakit.nama_indonesia}')
            else:
                updated_count += 1
                self.stdout.write(f'  ↻ Diupdate: {penyakit.nama_indonesia}')
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSelesai! Dibuat: {created_count}, Diupdate: {updated_count}'
        ))
