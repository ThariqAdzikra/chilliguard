"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, History } from "lucide-react";
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
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-20 px-4 py-4 safe-area-top"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-2xl",
                "bg-white/10 backdrop-blur-md border border-white/20",
                "text-white hover:bg-white/20 hover:border-white/30",
                "transition-all duration-300"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-500/30 backdrop-blur-sm">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Scan Daun</h1>
              <p className="text-white/50 text-xs">ChiliGuard AI</p>
            </div>
          </div>

          {/* History Button */}
          <Link href="/riwayat">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-2xl",
                "bg-white/10 backdrop-blur-md border border-white/20",
                "text-white hover:bg-white/20 hover:border-white/30",
                "transition-all duration-300"
              )}
            >
              <History className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Scanner - Full Screen */}
      <div className="absolute inset-0 pt-24 pb-0 px-4">
        <Scanner onCapture={handleCapture} sedangMemproses={sedangMemproses} />
      </div>
    </div>
  );
}
