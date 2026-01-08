"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Leaf,
  Scan,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

// Animasi variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Data fitur untuk Bento Grid
const daftarFitur = [
  {
    id: "akurasi",
    judul: "99% Akurasi",
    deskripsi: "Model AI terlatih dengan ribuan gambar daun cabai untuk deteksi yang presisi",
    icon: Target,
    warna: "from-emerald-500 to-emerald-600",
    warnaGlow: "shadow-emerald-500/25",
    ukuran: "md:col-span-2",
  },
  {
    id: "realtime",
    judul: "Real-time Scan",
    deskripsi: "Hasil diagnosis dalam hitungan detik",
    icon: Zap,
    warna: "from-amber-500 to-amber-600",
    warnaGlow: "shadow-amber-500/25",
    ukuran: "md:col-span-1",
  },
  {
    id: "konsultasi",
    judul: "Konsultasi Pakar AI",
    deskripsi: "Tanya jawab langsung dengan asisten AI",
    icon: MessageCircle,
    warna: "from-blue-500 to-blue-600",
    warnaGlow: "shadow-blue-500/25",
    ukuran: "md:col-span-1",
  },
  {
    id: "gratis",
    judul: "Gratis Selamanya",
    deskripsi: "Tidak ada biaya tersembunyi, sepenuhnya gratis",
    icon: Sparkles,
    warna: "from-purple-500 to-purple-600",
    warnaGlow: "shadow-purple-500/25",
    ukuran: "md:col-span-2",
  },
];

// Daftar penyakit yang dapat dideteksi
const daftarPenyakit = [
  "Anthracnose (Antraknosa)",
  "Damping Off (Rebah Kecambah)",
  "Leaf Curl (Keriting Daun)",
  "Leaf Spot (Bercak Daun)",
  "Veinal Mottle",
  "Whitefly (Kutu Kebul)",
  "Yellowish (Menguning)",
];

export default function BerandaPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Leaf className="w-4 h-4" />
                Powered by AI Technology
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            >
              Selamatkan Panen Cabai
              <br />
              <span className="text-gradient">Anda dengan AI</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Deteksi penyakit tanaman cabai dalam hitungan detik.
              <br className="hidden md:block" />
              <span className="font-semibold text-foreground">Akurat, Cepat, dan Gratis.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/scan">
                <Button
                  size="lg"
                  className={cn(
                    "group relative px-8 py-6 text-lg font-semibold rounded-2xl",
                    "bg-gradient-to-r from-emerald-500 to-emerald-600",
                    "hover:from-emerald-600 hover:to-emerald-700",
                    "text-white shadow-xl shadow-emerald-500/30",
                    "animate-pulse-glow"
                  )}
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Mulai Deteksi Sekarang
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl border-2"
              >
                <Shield className="w-5 h-5 mr-2" />
                Pelajari Lebih Lanjut
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mt-16 mx-auto max-w-4xl"
          >
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden glass-card shadow-2xl">
              {/* Placeholder untuk ilustrasi */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                  >
                    <Leaf className="w-16 h-16 text-white" />
                  </motion.div>
                  <p className="text-xl font-semibold text-foreground">
                    Scan Daun Cabai Anda
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Arahkan kamera ke daun untuk memulai diagnosa
                  </p>
                </div>
              </div>

              {/* Scan Overlay Animation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan-line opacity-50" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute -left-4 top-1/4 p-4 rounded-2xl glass-card shadow-lg"
            >
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              className="absolute -right-4 top-1/3 p-4 rounded-2xl glass-card shadow-lg"
            >
              <Zap className="w-8 h-8 text-amber-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mengapa <span className="text-gradient">ChiliGuard</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Teknologi AI terdepan untuk melindungi tanaman cabai Anda
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {daftarFitur.map((fitur, index) => {
              const Icon = fitur.icon;

              return (
                <motion.div
                  key={fitur.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(fitur.ukuran)}
                >
                  <Card
                    className={cn(
                      "group relative h-full p-6 rounded-3xl",
                      "glass-card hover:shadow-xl transition-all duration-300",
                      "border-2 border-transparent hover:border-emerald-500/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                        "bg-gradient-to-br",
                        fitur.warna,
                        "shadow-lg",
                        fitur.warnaGlow
                      )}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{fitur.judul}</h3>
                    <p className="text-muted-foreground">{fitur.deskripsi}</p>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Diseases Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Penyakit yang Dapat <span className="text-gradient">Dideteksi</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ChiliGuard dapat mengidentifikasi berbagai penyakit umum pada tanaman cabai
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {daftarPenyakit.map((penyakit, index) => (
              <motion.div
                key={penyakit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 rounded-2xl glass-card hover:shadow-lg transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{penyakit}</span>
                </Card>
              </motion.div>
            ))}

            {/* Healthy Indicators */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: daftarPenyakit.length * 0.05 }}
            >
              <Card className="p-4 rounded-2xl glass-card hover:shadow-lg transition-all flex items-center gap-3 border-emerald-500/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Daun & Buah Sehat
                </span>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            {/* Content */}
            <div className="relative text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Melindungi Panen Anda?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Mulai deteksi penyakit tanaman cabai sekarang juga. Gratis, cepat, dan akurat.
              </p>

              <Link href="/scan">
                <Button
                  size="lg"
                  className={cn(
                    "px-8 py-6 text-lg font-semibold rounded-2xl",
                    "bg-white text-emerald-600",
                    "hover:bg-white/90",
                    "shadow-xl"
                  )}
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Mulai Scan Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold">
              Chili<span className="text-gradient">Guard</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ChiliGuard AI. Dibuat dengan ❤️ untuk petani Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
