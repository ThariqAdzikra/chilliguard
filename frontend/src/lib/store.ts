/**
 * Store Zustand untuk ChiliGuard
 * 
 * Mengelola state global aplikasi termasuk hasil scan,
 * status loading, dan riwayat diagnosis.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HasilPrediksi } from './api';

// Interface untuk item riwayat
export interface ItemRiwayat {
  id: string;
  tanggal: string;
  gambar: string;
  hasil: HasilPrediksi;
}

// Interface untuk state aplikasi
interface StateAplikasi {
  // State scan
  gambarTangkapan: string | null;
  sedangMemproses: boolean;
  hasilPrediksi: HasilPrediksi | null;
  
  // Riwayat
  riwayatDiagnosis: ItemRiwayat[];
  
  // Chat AI
  pesanChat: PesanChat[];
  sedangMengetik: boolean;
  
  // Actions
  setGambarTangkapan: (gambar: string | null) => void;
  setSedangMemproses: (status: boolean) => void;
  setHasilPrediksi: (hasil: HasilPrediksi | null) => void;
  tambahRiwayat: (item: ItemRiwayat) => void;
  hapusRiwayat: (id: string) => void;
  bersihkanRiwayat: () => void;
  tambahPesanChat: (pesan: PesanChat) => void;
  setSedangMengetik: (status: boolean) => void;
  bersihkanChat: () => void;
  resetState: () => void;
}

// Interface untuk pesan chat
export interface PesanChat {
  id: string;
  peran: 'pengguna' | 'asisten';
  konten: string;
  waktu: string;
}

// State awal
const stateAwal = {
  gambarTangkapan: null,
  sedangMemproses: false,
  hasilPrediksi: null,
  riwayatDiagnosis: [],
  pesanChat: [],
  sedangMengetik: false,
};

// Buat store dengan persist untuk riwayat
export const useStore = create<StateAplikasi>()(
  persist(
    (set) => ({
      ...stateAwal,

      // Actions untuk scan
      setGambarTangkapan: (gambar) => set({ gambarTangkapan: gambar }),
      
      setSedangMemproses: (status) => set({ sedangMemproses: status }),
      
      setHasilPrediksi: (hasil) => set({ hasilPrediksi: hasil }),

      // Actions untuk riwayat
      tambahRiwayat: (item) =>
        set((state) => ({
          riwayatDiagnosis: [item, ...state.riwayatDiagnosis].slice(0, 50), // Simpan max 50 item
        })),
      
      hapusRiwayat: (id) =>
        set((state) => ({
          riwayatDiagnosis: state.riwayatDiagnosis.filter((item) => item.id !== id),
        })),
      
      bersihkanRiwayat: () => set({ riwayatDiagnosis: [] }),

      // Actions untuk chat
      tambahPesanChat: (pesan) =>
        set((state) => ({
          pesanChat: [...state.pesanChat, pesan],
        })),
      
      setSedangMengetik: (status) => set({ sedangMengetik: status }),
      
      bersihkanChat: () => set({ pesanChat: [] }),

      // Reset semua state
      resetState: () => set(stateAwal),
    }),
    {
      name: 'chilliguard-storage',
      partialize: (state) => ({
        riwayatDiagnosis: state.riwayatDiagnosis,
      }),
    }
  )
);

/**
 * Helper untuk generate ID unik
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper untuk format tanggal
 */
export function formatTanggal(tanggal: string | Date): string {
  const dateObj = typeof tanggal === 'string' ? new Date(tanggal) : tanggal;
  
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
