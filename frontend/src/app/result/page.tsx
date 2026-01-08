"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Scan,
  Share2,
  Download,
  Leaf,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DiagnosisCard from "@/components/DiagnosisCard";
import TreatmentAccordion from "@/components/TreatmentAccordion";
import ChatWidget from "@/components/ChatWidget";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ResultPage() {
  const router = useRouter();
  const { gambarTangkapan, hasilPrediksi, resetState } = useStore();

  // Redirect if no result
  useEffect(() => {
    if (!hasilPrediksi) {
      router.push("/scan");
    }
  }, [hasilPrediksi, router]);

  // Handle share
  const handleBagikan = async () => {
    if (!hasilPrediksi) return;

    const teksShare = `🌶️ ChiliGuard AI - Hasil Diagnosis\n\nPenyakit: ${hasilPrediksi.namaIndonesia}\nKepercayaan: ${hasilPrediksi.persentaseKepercayaan.toFixed(1)}%\nStatus: ${hasilPrediksi.statusSehat ? "Sehat" : "Butuh Penanganan"}\n\nDiagnosis dengan teknologi AI ChiliGuard`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "ChiliGuard AI - Hasil Diagnosis",
          text: teksShare,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(teksShare);
        toast.success("Disalin!", {
          description: "Hasil diagnosis telah disalin ke clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Handle download
  const handleUnduh = () => {
    if (!gambarTangkapan) return;

    const link = document.createElement("a");
    link.href = gambarTangkapan;
    link.download = `chilliguard-diagnosis-${Date.now()}.jpg`;
    link.click();

    toast.success("Berhasil!", {
      description: "Gambar telah diunduh",
    });
  };

  // Handle new scan
  const handleScanBaru = () => {
    resetState();
    router.push("/scan");
  };

  if (!hasilPrediksi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Leaf className="w-8 h-8 text-muted-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 glass-card border-b"
      >
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-semibold">Hasil Diagnosis</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBagikan}
              className="rounded-full"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Captured Image */}
        {gambarTangkapan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden rounded-3xl glass-card">
              <div className="aspect-[4/3] relative">
                <Image
                  src={gambarTangkapan}
                  alt="Gambar yang dianalisis"
                  fill
                  className="object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Verified Badge */}
                {hasilPrediksi.persentaseKepercayaan >= 90 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute top-4 right-4"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold",
                        "backdrop-blur-md",
                        hasilPrediksi.statusSehat
                          ? "bg-emerald-500/80 text-white"
                          : "bg-red-500/80 text-white"
                      )}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Terverifikasi AI
                    </div>
                  </motion.div>
                )}

                {/* Download Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUnduh}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Diagnosis Card */}
        <DiagnosisCard hasil={hasilPrediksi} />

        {/* Treatment Accordion */}
        <TreatmentAccordion hasil={hasilPrediksi} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            onClick={handleScanBaru}
            className="flex-1 h-14 rounded-2xl text-base font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Scan Ulang
          </Button>

          <Link href="/scan" className="flex-1">
            <Button
              className={cn(
                "w-full h-14 rounded-2xl text-base font-semibold",
                "bg-gradient-to-r from-emerald-500 to-emerald-600",
                "hover:from-emerald-600 hover:to-emerald-700",
                "shadow-lg shadow-emerald-500/25"
              )}
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan Baru
            </Button>
          </Link>
        </motion.div>

        {/* Other Predictions */}
        {hasilPrediksi.semuaPrediksi && hasilPrediksi.semuaPrediksi.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 rounded-3xl glass-card">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                Prediksi Lainnya
              </h3>
              <div className="space-y-2">
                {hasilPrediksi.semuaPrediksi.slice(1, 4).map((prediksi, index) => (
                  <div
                    key={prediksi.kelas}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{prediksi.kelas}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {(prediksi.kepercayaan * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Chat Widget FAB */}
      <ChatWidget hasilDiagnosis={hasilPrediksi} />
    </div>
  );
}
