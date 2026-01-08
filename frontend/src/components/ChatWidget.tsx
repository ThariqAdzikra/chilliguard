"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStore, generateId, type PesanChat } from "@/lib/store";
import type { HasilPrediksi } from "@/lib/api";

interface ChatWidgetProps {
  hasilDiagnosis: HasilPrediksi;
}

export default function ChatWidget({ hasilDiagnosis }: ChatWidgetProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [inputPesan, setInputPesan] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    pesanChat,
    sedangMengetik,
    tambahPesanChat,
    setSedangMengetik,
    bersihkanChat,
  } = useStore();

  // Scroll to bottom when new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [pesanChat, sedangMengetik]);

  // Focus input when opened
  useEffect(() => {
    if (terbuka && inputRef.current) {
      inputRef.current.focus();
    }
  }, [terbuka]);

  // Add welcome message on first open
  useEffect(() => {
    if (terbuka && pesanChat.length === 0) {
      const pesanSelamatDatang: PesanChat = {
        id: generateId(),
        peran: "asisten",
        konten: `Halo! 👋 Saya adalah asisten AI ChiliGuard. Saya melihat tanaman Anda terdeteksi **${hasilDiagnosis.namaIndonesia}**. Ada yang ingin Anda tanyakan tentang kondisi ini atau cara penanganannya?`,
        waktu: new Date().toISOString(),
      };
      tambahPesanChat(pesanSelamatDatang);
    }
  }, [terbuka, pesanChat.length, hasilDiagnosis.namaIndonesia, tambahPesanChat]);

  // Handle send message
  const kirimPesan = useCallback(async () => {
    if (!inputPesan.trim() || sedangMengetik) return;

    const pesanBaru: PesanChat = {
      id: generateId(),
      peran: "pengguna",
      konten: inputPesan.trim(),
      waktu: new Date().toISOString(),
    };

    tambahPesanChat(pesanBaru);
    setInputPesan("");
    setSedangMengetik(true);

    // Simulate AI response (replace with actual Gemini API call)
    setTimeout(() => {
      const responsAI = generateResponseSimulasi(inputPesan, hasilDiagnosis);
      const pesanAI: PesanChat = {
        id: generateId(),
        peran: "asisten",
        konten: responsAI,
        waktu: new Date().toISOString(),
      };
      tambahPesanChat(pesanAI);
      setSedangMengetik(false);
    }, 1500);
  }, [inputPesan, sedangMengetik, tambahPesanChat, setSedangMengetik, hasilDiagnosis]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      kirimPesan();
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTerbuka(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-16 h-16 rounded-full",
          "bg-gradient-to-br from-emerald-500 to-emerald-600",
          "text-white shadow-xl shadow-emerald-500/30",
          "flex items-center justify-center",
          "transition-all duration-200",
          terbuka && "hidden"
        )}
      >
        <MessageCircle className="w-7 h-7" />
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          !
        </span>
      </motion.button>

      {/* Chat Sheet */}
      <AnimatePresence>
        {terbuka && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTerbuka(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "h-[85vh] max-h-[700px]",
                "bg-background rounded-t-3xl",
                "shadow-2xl"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Konsultan AI</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Powered by Gemini
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTerbuka(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]"
              >
                {pesanChat.map((pesan, index) => (
                  <motion.div
                    key={pesan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex gap-3",
                      pesan.peran === "pengguna" ? "justify-end" : "justify-start"
                    )}
                  >
                    {pesan.peran === "asisten" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl",
                        pesan.peran === "pengguna"
                          ? "bg-muted text-foreground rounded-br-md"
                          : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-bl-md"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{pesan.konten}</p>
                    </div>

                    {pesan.peran === "pengguna" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {sedangMengetik && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce-dot" />
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce-dot-delay-1" />
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce-dot-delay-2" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputPesan}
                    onChange={(e) => setInputPesan(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pertanyaan Anda..."
                    disabled={sedangMengetik}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-2xl",
                      "bg-muted border-0",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      "placeholder:text-muted-foreground",
                      "disabled:opacity-50"
                    )}
                  />
                  <Button
                    onClick={kirimPesan}
                    disabled={!inputPesan.trim() || sedangMengetik}
                    className={cn(
                      "w-12 h-12 rounded-2xl",
                      "bg-gradient-to-br from-emerald-500 to-emerald-600",
                      "hover:from-emerald-600 hover:to-emerald-700",
                      "shadow-lg shadow-emerald-500/25"
                    )}
                  >
                    {sedangMengetik ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Simulated AI response (replace with actual Gemini API integration)
function generateResponseSimulasi(pertanyaan: string, hasil: HasilPrediksi): string {
  const pertanyaanLower = pertanyaan.toLowerCase();

  if (pertanyaanLower.includes("obat") || pertanyaanLower.includes("fungisida")) {
    if (hasil.penangananKimia.length > 0) {
      return `Untuk penanganan **${hasil.namaIndonesia}**, berikut rekomendasi produk yang bisa digunakan:\n\n${hasil.penangananKimia.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n⚠️ Pastikan mengikuti petunjuk dosis yang tertera pada kemasan dan gunakan APD saat aplikasi.`;
    }
    return "Untuk kondisi tanaman sehat, tidak diperlukan penggunaan fungisida atau pestisida khusus. Fokus pada perawatan preventif dan pemupukan berimbang.";
  }

  if (pertanyaanLower.includes("organik") || pertanyaanLower.includes("alami")) {
    if (hasil.penangananOrganik.length > 0) {
      return `Berikut penanganan organik untuk **${hasil.namaIndonesia}**:\n\n${hasil.penangananOrganik.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n🌿 Penanganan organik lebih aman untuk lingkungan dan tidak meninggalkan residu pada tanaman.`;
    }
    return "Tanaman Anda dalam kondisi sehat. Untuk menjaga kesehatan secara organik, gunakan pupuk kompos dan hindari penggunaan pestisida sintetis.";
  }

  if (pertanyaanLower.includes("pencegahan") || pertanyaanLower.includes("cegah")) {
    if (hasil.pencegahan.length > 0) {
      return `Tips pencegahan **${hasil.namaIndonesia}**:\n\n${hasil.pencegahan.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n💡 Pencegahan lebih baik daripada pengobatan. Terapkan langkah-langkah ini secara konsisten.`;
    }
    return "Untuk menjaga kesehatan tanaman, lakukan perawatan rutin, pemangkasan, dan jaga kebersihan lahan.";
  }

  if (pertanyaanLower.includes("gejala") || pertanyaanLower.includes("ciri")) {
    if (hasil.gejala.length > 0) {
      return `Gejala **${hasil.namaIndonesia}** yang perlu diwaspadai:\n\n${hasil.gejala.map((item, i) => `• ${item}`).join("\n")}\n\n👀 Pantau tanaman secara berkala untuk deteksi dini.`;
    }
    return "Tanaman sehat biasanya memiliki daun berwarna hijau segar, pertumbuhan normal, dan tidak ada bercak atau kerusakan.";
  }

  // Default response
  return `Terima kasih atas pertanyaan Anda tentang "${pertanyaan}". \n\nBerdasarkan diagnosis **${hasil.namaIndonesia}** dengan tingkat kepercayaan ${hasil.persentaseKepercayaan.toFixed(1)}%, saya sarankan untuk:\n\n1. Memahami gejala yang muncul\n2. Menerapkan penanganan yang sesuai\n3. Melakukan pencegahan untuk tanaman lain\n\nSilakan tanyakan lebih spesifik tentang penanganan organik, kimia, atau pencegahan!`;
}
