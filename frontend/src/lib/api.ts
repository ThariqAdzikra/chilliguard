/**
 * Layanan API untuk ChiliGuard
 * 
 * Modul ini berisi fungsi-fungsi untuk berkomunikasi dengan backend Django
 * dan API Gemini untuk konsultasi AI.
 */

// URL dasar API backend
const URL_API_BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Interface untuk response prediksi
export interface HasilPrediksi {
  sukses: boolean;
  kelas: string;
  namaIndonesia: string;
  kepercayaan: number;
  persentaseKepercayaan: number;
  statusSehat: boolean;
  deskripsi: string;
  gejala: string[];
  penangananOrganik: string[];
  penangananKimia: string[];
  pencegahan: string[];
  semuaPrediksi: {
    kelas: string;
    kepercayaan: number;
  }[];
  pesan?: string;
}

// Interface untuk response health check
export interface StatusKesehatan {
  status: string;
  pesan: string;
  versi: string;
}

// Interface untuk daftar kelas
export interface ItemKelas {
  kelas: string;
  namaIndonesia: string;
  deskripsi: string;
}

export interface DaftarKelas {
  sukses: boolean;
  jumlahKelas: number;
  daftarKelas: ItemKelas[];
}

/**
 * Mengirim gambar ke API untuk diprediksi
 * 
 * @param fileGambar - File gambar yang akan dianalisis
 * @returns Promise<HasilPrediksi>
 */
export async function kirimPrediksi(fileGambar: File): Promise<HasilPrediksi> {
  const formData = new FormData();
  formData.append('image', fileGambar);

  try {
    const response = await fetch(`${URL_API_BACKEND}/predict/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.pesan || `HTTP error! status: ${response.status}`);
    }

    const data: HasilPrediksi = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat mengirim prediksi:', error);
    throw error;
  }
}

/**
 * Memeriksa status kesehatan API
 * 
 * @returns Promise<StatusKesehatan>
 */
export async function cekKesehatan(): Promise<StatusKesehatan> {
  try {
    const response = await fetch(`${URL_API_BACKEND}/health/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StatusKesehatan = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat cek kesehatan API:', error);
    throw error;
  }
}

/**
 * Mendapatkan daftar semua kelas penyakit
 * 
 * @returns Promise<DaftarKelas>
 */
export async function ambilDaftarKelas(): Promise<DaftarKelas> {
  try {
    const response = await fetch(`${URL_API_BACKEND}/classes/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DaftarKelas = await response.json();
    return data;
  } catch (error) {
    console.error('Error saat mengambil daftar kelas:', error);
    throw error;
  }
}

/**
 * Mengkonversi base64 ke File object
 * 
 * @param dataBase64 - String base64 dari gambar
 * @param namaFile - Nama file yang akan dibuat
 * @returns File
 */
export function base64KeFile(dataBase64: string, namaFile: string = 'capture.jpg'): File {
  // Hapus prefix data URL jika ada
  const base64Bersih = dataBase64.replace(/^data:image\/\w+;base64,/, '');
  
  // Decode base64
  const byteString = atob(base64Bersih);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  // Tentukan tipe MIME
  let tipeMime = 'image/jpeg';
  if (dataBase64.includes('data:image/png')) {
    tipeMime = 'image/png';
  } else if (dataBase64.includes('data:image/webp')) {
    tipeMime = 'image/webp';
  }
  
  // Buat File object
  const blob = new Blob([uint8Array], { type: tipeMime });
  return new File([blob], namaFile, { type: tipeMime });
}

/**
 * Kompresi gambar sebelum upload
 * 
 * @param fileGambar - File gambar asli
 * @param kualitas - Kualitas kompresi (0-1)
 * @param ukuranMaksimal - Ukuran maksimal dalam pixel
 * @returns Promise<File>
 */
export async function kompresGambar(
  fileGambar: File,
  kualitas: number = 0.8,
  ukuranMaksimal: number = 1024
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let lebar = img.width;
        let tinggi = img.height;
        
        // Resize jika terlalu besar
        if (lebar > ukuranMaksimal || tinggi > ukuranMaksimal) {
          if (lebar > tinggi) {
            tinggi = (tinggi / lebar) * ukuranMaksimal;
            lebar = ukuranMaksimal;
          } else {
            lebar = (lebar / tinggi) * ukuranMaksimal;
            tinggi = ukuranMaksimal;
          }
        }
        
        canvas.width = lebar;
        canvas.height = tinggi;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal mendapatkan context canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, lebar, tinggi);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengkompresi gambar'));
              return;
            }
            
            const fileKompresi = new File([blob], fileGambar.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(fileKompresi);
          },
          'image/jpeg',
          kualitas
        );
      };
      
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(fileGambar);
  });
}
