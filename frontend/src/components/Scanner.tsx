"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
      <div className="relative flex-1 bg-black rounded-3xl overflow-hidden">
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
              className="absolute inset-0 flex items-center justify-center bg-slate-900"
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">Memuat Kamera...</p>
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
              className="absolute inset-0 flex items-center justify-center bg-slate-900 p-6"
            >
              <div className="text-center">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-white font-medium mb-4">{errorKamera}</p>
                <Button
                  onClick={bukaFileUpload}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Gambar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Overlay */}
        {kameraSiap && (
          <>
            {/* Guide Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[80%] max-w-[300px] aspect-square">
                {/* Corner Decorations */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {/* Top Left */}
                  <path
                    d="M 0 25 L 0 5 Q 0 0 5 0 L 25 0"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Top Right */}
                  <path
                    d="M 75 0 L 95 0 Q 100 0 100 5 L 100 25"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Bottom Right */}
                  <path
                    d="M 100 75 L 100 95 Q 100 100 95 100 L 75 100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Bottom Left */}
                  <path
                    d="M 25 100 L 5 100 Q 0 100 0 95 L 0 75"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Scan Line Animation */}
                <motion.div
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  style={{ boxShadow: "0 0 10px #10b981, 0 0 20px #10b981" }}
                />
              </div>
            </div>

            {/* Instruction */}
            <div className="absolute bottom-24 left-0 right-0 text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 text-sm font-medium px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm inline-block"
              >
                Posisikan daun cabai di dalam bingkai
              </motion.p>
            </div>
          </>
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {sedangMemproses && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto mb-6"
                />
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <p className="text-white font-semibold text-lg mb-2">
                    Menganalisis Gambar...
                  </p>
                  <p className="text-emerald-400 text-sm">
                    Mendeteksi pola penyakit
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Upload Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={bukaFileUpload}
              disabled={sedangMemproses}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <Upload className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Capture Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={ambilGambar}
            disabled={!kameraSiap || sedangMemproses}
            className={cn(
              "relative w-20 h-20 rounded-full",
              "border-4 border-white",
              "flex items-center justify-center",
              "transition-all duration-200",
              !kameraSiap || sedangMemproses
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-emerald-400"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full",
                "bg-gradient-to-br from-emerald-500 to-emerald-600",
                "flex items-center justify-center",
                "shadow-lg shadow-emerald-500/30"
              )}
            >
              <Camera className="w-7 h-7 text-white" />
            </div>
          </motion.button>

          {/* Flash / Switch Camera */}
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFlash}
                disabled={sedangMemproses}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                {flashAktif ? (
                  <Zap className="w-5 h-5 text-amber-400" />
                ) : (
                  <ZapOff className="w-5 h-5" />
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={gantiKamera}
                disabled={sedangMemproses}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <SwitchCamera className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

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
