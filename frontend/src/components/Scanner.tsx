"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  SwitchCamera,
  Upload,
  Zap,
  ZapOff,
  X,
  Loader2,
  Focus,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Props interface
interface ScannerProps {
  onCapture: (gambarBase64: string) => void;
  sedangMemproses?: boolean;
}

// Video constraints
const constraintVideo = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "environment",
};

export default function Scanner({ onCapture, sedangMemproses = false }: ScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  
  const [kameraSiap, setKameraSiap] = useState(false);
  const [errorKamera, setErrorKamera] = useState<string | null>(null);
  const [flashAktif, setFlashAktif] = useState(false);
  const [modeFacing, setModeFacing] = useState<"user" | "environment">("environment");

  // Handle camera ready
  const handleKameraSiap = useCallback(() => {
    setKameraSiap(true);
    setErrorKamera(null);
  }, []);

  // Handle camera error
  const handleErrorKamera = useCallback((error: string | DOMException) => {
    console.error("Error kamera:", error);
    setErrorKamera("Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.");
    setKameraSiap(false);
  }, []);

  // Toggle flash
  const toggleFlash = useCallback(async () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if ("torch" in capabilities) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashAktif } as MediaTrackConstraintSet],
        });
        setFlashAktif(!flashAktif);
      } catch (error) {
        console.error("Gagal toggle flash:", error);
      }
    }
  }, [flashAktif]);

  // Switch camera
  const gantiKamera = useCallback(() => {
    setModeFacing((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  // Capture image
  const ambilGambar = useCallback(() => {
    if (!webcamRef.current || sedangMemproses) return;

    const gambarBase64 = webcamRef.current.getScreenshot();
    if (gambarBase64) {
      onCapture(gambarBase64);
    }
  }, [onCapture, sedangMemproses]);

  // Handle file upload
  const handleUploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const hasil = e.target?.result as string;
        if (hasil) {
          onCapture(hasil);
        }
      };
      reader.readAsDataURL(file);
    },
    [onCapture]
  );

  // Trigger file input
  const bukaFileUpload = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Camera View */}
      <div className="relative flex-1 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/60 z-[1] pointer-events-none" />
        
        {/* Webcam */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.9}
          videoConstraints={{
            ...constraintVideo,
            facingMode: modeFacing,
          }}
          onUserMedia={handleKameraSiap}
          onUserMediaError={handleErrorKamera}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Loading State */}
        <AnimatePresence>
          {!kameraSiap && !errorKamera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 z-10"
            >
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 mx-auto" />
                  <Loader2 className="w-20 h-20 text-emerald-500 animate-spin absolute inset-0" />
                </div>
                <p className="text-white font-semibold mt-6 text-lg">Memuat Kamera</p>
                <p className="text-white/50 text-sm mt-1">Mohon tunggu sebentar...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {errorKamera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-8 z-10"
            >
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-white font-semibold text-lg mb-2">Kamera Tidak Tersedia</p>
                <p className="text-white/60 text-sm mb-6">{errorKamera}</p>
                <Button
                  onClick={bukaFileUpload}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Gambar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Overlay */}
        {kameraSiap && (
          <>
            {/* Vignette effect */}
            <div className="absolute inset-0 pointer-events-none z-[2]" 
              style={{ 
                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)' 
              }} 
            />

            {/* Guide Frame - Centered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]">
              <div className="relative w-[75%] max-w-[280px] aspect-square">
                {/* Animated Corner Brackets */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Top Left Corner */}
                  <div className="absolute top-0 left-0 w-12 h-12">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
                  </div>
                  
                  {/* Top Right Corner */}
                  <div className="absolute top-0 right-0 w-12 h-12">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-400 to-transparent rounded-full" />
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
                  </div>
                  
                  {/* Bottom Left Corner */}
                  <div className="absolute bottom-0 left-0 w-12 h-12">
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
                    <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-emerald-400 to-transparent rounded-full" />
                  </div>
                  
                  {/* Bottom Right Corner */}
                  <div className="absolute bottom-0 right-0 w-12 h-12">
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-400 to-transparent rounded-full" />
                    <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-emerald-400 to-transparent rounded-full" />
                  </div>
                </motion.div>

                {/* Center Focus Icon */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Focus className="w-8 h-8 text-emerald-400/50" />
                </motion.div>

                {/* Scan Line Animation */}
                <motion.div
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-2 right-2 h-[2px] rounded-full"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent, #34d399, transparent)',
                    boxShadow: "0 0 15px #10b981, 0 0 30px #10b981" 
                  }}
                />
              </div>
            </div>

            {/* Instruction Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-20 left-0 right-0 text-center z-[4]"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Posisikan daun dalam bingkai</span>
              </span>
            </motion.div>
          </>
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {sedangMemproses && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20"
            >
              <div className="text-center">
                {/* Animated rings */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400/50"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <p className="text-white font-bold text-xl mb-2">
                    Menganalisis Gambar
                  </p>
                  <p className="text-emerald-400 text-sm font-medium">
                    AI sedang mendeteksi penyakit...
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls - Perfectly Centered Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="py-6 px-4"
      >
        {/* Control Bar - Using grid for perfect centering */}
        <div className="grid grid-cols-5 gap-3 items-center max-w-md mx-auto">
          {/* Left Side: Upload */}
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={bukaFileUpload}
                disabled={sedangMemproses}
                className={cn(
                  "w-14 h-14 rounded-2xl",
                  "bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white hover:bg-white/20 hover:border-white/30",
                  "transition-all duration-300",
                  "disabled:opacity-50"
                )}
              >
                <Upload className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>

          {/* Left-Center: Flash */}
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFlash}
                disabled={sedangMemproses}
                className={cn(
                  "w-14 h-14 rounded-2xl",
                  "bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white hover:bg-white/20 hover:border-white/30",
                  "transition-all duration-300",
                  flashAktif && "bg-amber-500/20 border-amber-500/50"
                )}
              >
                {flashAktif ? (
                  <Zap className="w-6 h-6 text-amber-400" />
                ) : (
                  <ZapOff className="w-6 h-6" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Center: Capture Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={ambilGambar}
              disabled={!kameraSiap || sedangMemproses}
              className={cn(
                "relative w-20 h-20 rounded-full",
                "bg-gradient-to-br from-white/20 to-white/5",
                "border-4 border-white/80",
                "flex items-center justify-center",
                "shadow-xl shadow-black/20",
                "transition-all duration-300",
                !kameraSiap || sedangMemproses
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-emerald-400 hover:shadow-emerald-500/20"
              )}
            >
              {/* Inner Circle */}
              <motion.div
                animate={kameraSiap && !sedangMemproses ? { scale: [1, 0.95, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "w-14 h-14 rounded-full",
                  "bg-gradient-to-br from-emerald-400 to-emerald-600",
                  "flex items-center justify-center",
                  "shadow-lg shadow-emerald-500/40"
                )}
              >
                <Camera className="w-7 h-7 text-white" />
              </motion.div>
              
              {/* Pulse ring animation */}
              {kameraSiap && !sedangMemproses && (
                <motion.div
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400"
                />
              )}
            </motion.button>
          </div>

          {/* Right-Center: Switch Camera */}
          <div className="flex justify-start">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={gantiKamera}
                disabled={sedangMemproses}
                className={cn(
                  "w-14 h-14 rounded-2xl",
                  "bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white hover:bg-white/20 hover:border-white/30",
                  "transition-all duration-300",
                  "disabled:opacity-50"
                )}
              >
                <SwitchCamera className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>

          {/* Right Side: Gallery/Recent (placeholder) */}
          <div className="flex justify-start">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={bukaFileUpload}
                disabled={sedangMemproses}
                className={cn(
                  "w-14 h-14 rounded-2xl",
                  "bg-white/10 backdrop-blur-md border border-white/20",
                  "text-white hover:bg-white/20 hover:border-white/30",
                  "transition-all duration-300",
                  "disabled:opacity-50"
                )}
              >
                <ImageIcon className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Tips - Below controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-white/50 text-xs">
            💡 <span className="text-white/70">Tips:</span> Pastikan pencahayaan cukup untuk hasil akurat
          </p>
        </motion.div>
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUploadFile}
        className="hidden"
      />
    </div>
  );
}
