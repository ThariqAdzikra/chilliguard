"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Leaf,
  Scan,
  Zap,
  ArrowRight,
  ArrowDown,
  Target,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Camera,
  Brain,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Feature data
const features = [
  {
    icon: Target,
    title: "99% Akurasi",
    description: "Model AI terlatih dengan ribuan gambar daun cabai",
  },
  {
    icon: Zap,
    title: "Real-time",
    description: "Hasil diagnosis dalam hitungan detik",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi AI",
    description: "Tanya jawab langsung dengan asisten AI",
  },
  {
    icon: Sparkles,
    title: "Gratis Selamanya",
    description: "Tidak ada biaya tersembunyi",
  },
];

// Disease list
const diseases = [
  "Anthracnose",
  "Damping Off",
  "Leaf Curl",
  "Leaf Spot",
  "Veinal Mottle",
  "Whitefly",
  "Yellowish",
  "Healthy Leaf",
];

// How it works steps
const steps = [
  {
    icon: Camera,
    title: "Foto Daun",
    description: "Arahkan kamera ke daun cabai yang ingin diperiksa",
  },
  {
    icon: Brain,
    title: "Analisis AI",
    description: "AI akan menganalisis gambar dalam hitungan detik",
  },
  {
    icon: Shield,
    title: "Hasil & Solusi",
    description: "Dapatkan diagnosis lengkap beserta rekomendasi pengobatan",
  },
];

export default function BerandaPage() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section - Full Viewport */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
        
        {/* Emerald gradient accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/80 via-emerald-50/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/60 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-700">
                <Leaf className="w-4 h-4" />
                Powered by AI Technology
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8"
            >
              Lindungi Cabai
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Dengan AI
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Deteksi penyakit tanaman cabai dalam hitungan detik.
              <br />
              <span className="font-semibold text-gray-800">Akurat. Cepat. Gratis.</span>
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp}>
              <Link href="/scan">
                <Button
                  size="lg"
                  className={cn(
                    "group px-10 py-7 text-lg font-bold rounded-2xl",
                    "bg-gradient-to-r from-emerald-500 to-emerald-600",
                    "hover:from-emerald-600 hover:to-emerald-700",
                    "text-white shadow-2xl shadow-emerald-500/30",
                    "transition-all duration-300 hover:scale-105"
                  )}
                >
                  <Scan className="w-6 h-6 mr-3" />
                  Mulai Scan Sekarang
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Full Viewport */}
      <section className="min-h-screen flex items-center bg-gray-50/50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Mengapa{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                ChiliGuard
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              Teknologi AI terdepan untuk melindungi panen cabai Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section - Full Viewport */}
      <section className="min-h-screen flex items-center bg-white relative">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Cara{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Kerja
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              Tiga langkah mudah untuk mendiagnosis tanaman cabai Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 -translate-y-1/2" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative text-center"
                >
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shadow-lg z-10">
                    {index + 1}
                  </div>
                  
                  <div className="pt-8 pb-8 px-6">
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 flex items-center justify-center mb-8">
                      <Icon className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Diseases Section - Full Viewport */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-gray-50/50 to-white relative">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Penyakit yang Dapat{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Dideteksi
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto">
              ChiliGuard dapat mengidentifikasi berbagai kondisi pada tanaman cabai
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {diseases.map((disease, index) => (
              <motion.div
                key={disease}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={cn(
                  "group p-6 bg-white rounded-2xl border-2 transition-all duration-300 cursor-default",
                  disease === "Healthy Leaf"
                    ? "border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50"
                    : "border-gray-100 hover:border-emerald-200 hover:shadow-lg"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                      disease === "Healthy Leaf"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-br from-emerald-400 to-emerald-500"
                    )}
                  >
                    {disease === "Healthy Leaf" ? (
                      <Leaf className="w-6 h-6 text-white" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-semibold text-sm md:text-base",
                      disease === "Healthy Leaf" ? "text-emerald-700" : "text-gray-800"
                    )}
                  >
                    {disease}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Viewport */}
      <section className="min-h-screen flex items-center bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
            >
              <Leaf className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              Siap Melindungi
              <br />
              Panen Anda?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Mulai deteksi penyakit tanaman cabai sekarang juga.
              <br />
              <span className="text-white font-semibold">100% Gratis.</span>
            </p>

            <Link href="/scan">
              <Button
                size="lg"
                className={cn(
                  "group px-12 py-8 text-xl font-bold rounded-2xl",
                  "bg-white text-emerald-600",
                  "hover:bg-gray-50",
                  "shadow-2xl shadow-black/20",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                <Scan className="w-7 h-7 mr-3" />
                Mulai Scan Sekarang
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">
                  Chili<span className="text-emerald-400">Guard</span>
                </span>
                <p className="text-sm text-gray-400">AI-Powered Plant Disease Detection</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              © 2026 ChiliGuard AI. Dibuat dengan ❤️ untuk petani Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
