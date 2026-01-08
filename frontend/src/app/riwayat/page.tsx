"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Leaf,
  Trash2,
  Scan,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useStore, formatTanggal } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function RiwayatPage() {
  const router = useRouter();
  const {
    riwayatDiagnosis,
    hapusRiwayat,
    bersihkanRiwayat,
    setGambarTangkapan,
    setHasilPrediksi,
  } = useStore();

  // Handle view detail
  const handleLihatDetail = (id: string) => {
    const item = riwayatDiagnosis.find((r) => r.id === id);
    if (item) {
      setGambarTangkapan(item.gambar);
      setHasilPrediksi(item.hasil);
      router.push("/result");
    }
  };

  // Handle delete
  const handleHapus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hapusRiwayat(id);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-28 pb-8 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Riwayat Diagnosis</h1>
              <p className="text-muted-foreground">
                {riwayatDiagnosis.length > 0
                  ? `${riwayatDiagnosis.length} hasil diagnosis tersimpan`
                  : "Belum ada riwayat diagnosis"}
              </p>
            </div>

            {riwayatDiagnosis.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={bersihkanRiwayat}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Semua
              </Button>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {riwayatDiagnosis.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-muted flex items-center justify-center">
              <Clock className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Belum Ada Riwayat</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Hasil diagnosis Anda akan tersimpan di sini. Mulai scan daun cabai
              untuk mendapatkan diagnosis pertama.
            </p>
            <Link href="/scan">
              <Button
                className={cn(
                  "px-8 py-6 text-lg font-semibold rounded-2xl",
                  "bg-gradient-to-r from-emerald-500 to-emerald-600",
                  "hover:from-emerald-600 hover:to-emerald-700",
                  "shadow-lg shadow-emerald-500/25"
                )}
              >
                <Scan className="w-5 h-5 mr-2" />
                Mulai Scan
              </Button>
            </Link>
          </motion.div>
        )}

        {/* History List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {riwayatDiagnosis.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleLihatDetail(item.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl glass-card cursor-pointer",
                    "hover:shadow-xl transition-all duration-300",
                    "border-2 border-transparent",
                    item.hasil.statusSehat
                      ? "hover:border-emerald-500/30"
                      : "hover:border-red-500/30"
                  )}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.gambar}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                      {/* Status Overlay */}
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          item.hasil.statusSehat
                            ? "bg-emerald-500/20"
                            : "bg-red-500/20"
                        )}
                      >
                        {item.hasil.statusSehat ? (
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {item.hasil.namaIndonesia}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono">
                            {item.hasil.kelas}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleHapus(item.id, e)}
                          className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3">
                        <div
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                            item.hasil.statusSehat
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          )}
                        >
                          <span className="font-mono">
                            {item.hasil.persentaseKepercayaan.toFixed(0)}%
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {formatTanggal(item.tanggal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
