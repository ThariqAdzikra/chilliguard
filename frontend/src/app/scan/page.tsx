"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import Scanner from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import { useStore, generateId } from "@/lib/store";
import { kirimPrediksi, base64KeFile, kompresGambar } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ScanPage() {
  const router = useRouter();
  
  const {
    setGambarTangkapan,
    setSedangMemproses,
    setHasilPrediksi,
    tambahRiwayat,
    sedangMemproses,
  } = useStore();

  // Handle capture
  const handleCapture = useCallback(
    async (gambarBase64: string) => {
      try {
        // Set state
        setGambarTangkapan(gambarBase64);
        setSedangMemproses(true);

        // Convert base64 to File
        const fileAsli = base64KeFile(gambarBase64);

        // Compress image
        const fileKompresi = await kompresGambar(fileAsli, 0.8, 1024);

        // Send to API
        const hasil = await kirimPrediksi(fileKompresi);

        // Set result
        setHasilPrediksi(hasil);

        // Add to history
        tambahRiwayat({
          id: generateId(),
          tanggal: new Date().toISOString(),
          gambar: gambarBase64,
          hasil,
        });

        // Show success toast
        toast.success("Analisis Selesai!", {
          description: `Terdeteksi: ${hasil.namaIndonesia}`,
        });

        // Navigate to result
        router.push("/result");
      } catch (error) {
        console.error("Error saat analisis:", error);
        
        toast.error("Gagal Menganalisis", {
          description: error instanceof Error ? error.message : "Terjadi kesalahan saat menganalisis gambar",
        });
      } finally {
        setSedangMemproses(false);
      }
    },
    [
      setGambarTangkapan,
      setSedangMemproses,
      setHasilPrediksi,
      tambahRiwayat,
      router,
    ]
  );

  return (
    <div className="fixed inset-0 bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-10 p-4"
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-white font-semibold">Scan Daun</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      {/* Scanner */}
      <div className="absolute inset-0 pt-16 pb-4 px-4">
        <Scanner onCapture={handleCapture} sedangMemproses={sedangMemproses} />
      </div>

      {/* Tips */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-28 left-4 right-4"
      >
        <div className="glass p-4 rounded-2xl max-w-md mx-auto">
          <p className="text-white/70 text-xs text-center">
            💡 <span className="font-medium text-white/90">Tips:</span> Pastikan
            pencahayaan cukup dan daun terlihat jelas dalam bingkai untuk hasil
            yang akurat.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
