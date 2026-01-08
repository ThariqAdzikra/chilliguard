"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Scan, History, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Item navigasi
const itemNavigasi = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/riwayat", label: "Riwayat", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll untuk efek navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu saat route berubah
  useEffect(() => {
    setMenuTerbuka(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl",
        "transition-all duration-300"
      )}
    >
      <nav
        className={cn(
          "relative px-4 py-3 rounded-2xl",
          "glass-card shadow-lg",
          scrolled && "shadow-xl"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
            >
              <Leaf className="w-5 h-5" />
            </motion.div>
            <span className="text-lg font-bold text-foreground">
              Chili<span className="text-gradient">Guard</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {itemNavigasi.map((item) => {
              const aktif = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl",
                      "text-sm font-medium transition-all duration-200",
                      aktif
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Link href="/scan">
              <Button
                className={cn(
                  "bg-gradient-to-r from-emerald-500 to-emerald-600",
                  "hover:from-emerald-600 hover:to-emerald-700",
                  "text-white font-semibold rounded-xl",
                  "shadow-lg shadow-emerald-500/25",
                  "transition-all duration-300"
                )}
              >
                <Scan className="w-4 h-4 mr-2" />
                Mulai Scan
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuTerbuka(!menuTerbuka)}
          >
            <AnimatePresence mode="wait">
              {menuTerbuka ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuTerbuka && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                {itemNavigasi.map((item, index) => {
                  const aktif = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-sm font-medium transition-all duration-200",
                          aktif
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* CTA Mobile */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: itemNavigasi.length * 0.1 }}
                >
                  <Link href="/scan">
                    <Button
                      className={cn(
                        "w-full mt-2",
                        "bg-gradient-to-r from-emerald-500 to-emerald-600",
                        "hover:from-emerald-600 hover:to-emerald-700",
                        "text-white font-semibold rounded-xl"
                      )}
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      Mulai Scan Sekarang
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
