"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { HasilPrediksi } from "@/lib/api";

interface DiagnosisCardProps {
  hasil: HasilPrediksi;
}

export default function DiagnosisCard({ hasil }: DiagnosisCardProps) {
  const {
    kelas,
    namaIndonesia,
    kepercayaan,
    persentaseKepercayaan,
    statusSehat,
    deskripsi,
  } = hasil;

  // Determine colors based on status
  const warnaUtama = statusSehat ? "emerald" : "red";
  const tingkatKepercayaan = persentaseKepercayaan >= 90 ? "tinggi" : persentaseKepercayaan >= 70 ? "sedang" : "rendah";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 rounded-3xl glass-card overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "shadow-lg",
                statusSehat
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30"
                  : "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30"
              )}
            >
              {statusSehat ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-white" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{namaIndonesia}</h2>
              <p className="text-sm text-muted-foreground font-mono">{kelas}</p>
            </div>
          </div>

          {/* Verified Badge */}
          {persentaseKepercayaan >= 90 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
                statusSehat
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/20 text-red-600 dark:text-red-400"
              )}
            >
              <Shield className="w-3 h-3" />
              Terverifikasi
            </motion.div>
          )}
        </div>

        {/* Status */}
        <div
          className={cn(
            "p-4 rounded-2xl mb-6",
            statusSehat
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-red-500/10 border border-red-500/20"
          )}
        >
          <p
            className={cn(
              "font-semibold text-center",
              statusSehat
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {statusSehat ? "✅ Tanaman Sehat" : "⚠️ Butuh Penanganan Segera"}
          </p>
        </div>

        {/* Confidence */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tingkat Kepercayaan</span>
            </div>
            <span
              className={cn(
                "font-mono font-bold text-lg",
                tingkatKepercayaan === "tinggi"
                  ? "text-emerald-500"
                  : tingkatKepercayaan === "sedang"
                  ? "text-amber-500"
                  : "text-red-500"
              )}
            >
              {persentaseKepercayaan.toFixed(1)}%
            </span>
          </div>

          <Progress
            value={persentaseKepercayaan}
            className={cn(
              "h-3 rounded-full",
              tingkatKepercayaan === "tinggi"
                ? "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600"
                : tingkatKepercayaan === "sedang"
                ? "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-600"
                : "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600"
            )}
          />

          <p className="text-xs text-muted-foreground mt-2 text-center">
            {tingkatKepercayaan === "tinggi"
              ? "Hasil sangat akurat"
              : tingkatKepercayaan === "sedang"
              ? "Disarankan untuk konfirmasi ulang"
              : "Coba ambil gambar dengan pencahayaan lebih baik"}
          </p>
        </div>

        {/* Description */}
        {deskripsi && (
          <div className="p-4 rounded-2xl bg-muted/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {deskripsi}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
