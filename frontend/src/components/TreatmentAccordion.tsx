"use client";

import { motion } from "framer-motion";
import { Leaf, FlaskConical, ShieldCheck, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HasilPrediksi } from "@/lib/api";

interface TreatmentAccordionProps {
  hasil: HasilPrediksi;
}

// Config untuk setiap tipe penanganan
const configPenanganan = [
  {
    id: "organik",
    judul: "Penanganan Organik",
    icon: Leaf,
    warna: "from-green-500 to-green-600",
    warnaGlow: "shadow-green-500/20",
    warnaBg: "bg-green-500/10",
    warnaTeks: "text-green-600 dark:text-green-400",
    keyData: "penangananOrganik" as const,
  },
  {
    id: "kimia",
    judul: "Penanganan Kimia",
    icon: FlaskConical,
    warna: "from-blue-500 to-blue-600",
    warnaGlow: "shadow-blue-500/20",
    warnaBg: "bg-blue-500/10",
    warnaTeks: "text-blue-600 dark:text-blue-400",
    keyData: "penangananKimia" as const,
  },
  {
    id: "pencegahan",
    judul: "Pencegahan",
    icon: ShieldCheck,
    warna: "from-purple-500 to-purple-600",
    warnaGlow: "shadow-purple-500/20",
    warnaBg: "bg-purple-500/10",
    warnaTeks: "text-purple-600 dark:text-purple-400",
    keyData: "pencegahan" as const,
  },
];

export default function TreatmentAccordion({ hasil }: TreatmentAccordionProps) {
  // Check if any treatment data exists
  const adaDataPenanganan =
    hasil.penangananOrganik.length > 0 ||
    hasil.penangananKimia.length > 0 ||
    hasil.pencegahan.length > 0;

  if (!adaDataPenanganan) {
    return (
      <Card className="p-6 rounded-3xl glass-card text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Tidak Ada Penanganan Khusus</h3>
        <p className="text-sm text-muted-foreground">
          Tanaman Anda dalam kondisi sehat! Lanjutkan perawatan rutin untuk menjaga kesehatan tanaman.
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="rounded-3xl glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Rekomendasi Penanganan</h3>
        </div>

        <Accordion type="multiple" className="px-4 pb-4">
          {configPenanganan.map((config, index) => {
            const data = hasil[config.keyData];
            const Icon = config.icon;

            // Skip if no data
            if (!data || data.length === 0) return null;

            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem value={config.id} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      "py-4 hover:no-underline rounded-xl px-4 -mx-4",
                      "hover:bg-muted/50 transition-colors",
                      "[&[data-state=open]]:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          "bg-gradient-to-br shadow-lg",
                          config.warna,
                          config.warnaGlow
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{config.judul}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.length} langkah
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-2 pl-4 pt-2">
                      {data.map((item: string, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl",
                            config.warnaBg
                          )}
                        >
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              "bg-gradient-to-br text-white text-xs font-bold",
                              config.warna
                            )}
                          >
                            {idx + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>

        {/* Gejala Section */}
        {hasil.gejala && hasil.gejala.length > 0 && (
          <div className="px-4 pb-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="gejala" className="border-b-0">
                <AccordionTrigger
                  className={cn(
                    "py-4 hover:no-underline rounded-xl px-4 -mx-4",
                    "hover:bg-muted/50 transition-colors",
                    "[&[data-state=open]]:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Gejala yang Muncul</p>
                      <p className="text-xs text-muted-foreground">
                        {hasil.gejala.length} gejala teridentifikasi
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-2 pl-4 pt-2">
                    {hasil.gejala.map((gejala: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                        <p className="text-sm leading-relaxed">{gejala}</p>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
