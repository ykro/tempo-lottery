"use client";

import { WoodButton } from "@/components/ui/WoodButton";
import { WoodSign } from "@/components/ui/WoodSign";
import { CornerOrnaments } from "@/components/ui/CornerOrnaments";
import { Play, ScrollText, GalleryHorizontalEnd } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-12 relative overflow-hidden">
      <CornerOrnaments />

      {/* Title Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <WoodSign text="TEMPO" />
      </motion.div>

      {/* Menu Options */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-col w-full max-w-[300px] gap-6 z-10"
      >
        <Link href="/game" className="w-full group">
          <WoodButton className="h-24 text-2xl group-hover:scale-105 transition-transform rounded-xl">
            <span className="flex flex-col items-center leading-none gap-2">
              <Play className="w-8 h-8 opacity-80" strokeWidth={2.5} />
              <span className="vintage-text-strong text-xl">EL JUEGO</span>
            </span>
          </WoodButton>
        </Link>

        <Link href="/rules" className="w-full group">
          <WoodButton className="h-20 group-hover:scale-105 transition-transform rounded-xl">
            <span className="flex items-center gap-3">
              <ScrollText className="w-6 h-6 opacity-80" />
              <span className="vintage-text-strong text-lg">LAS REGLAS</span>
            </span>
          </WoodButton>
        </Link>
        <Link href="/deck" className="w-full group">
          <WoodButton className="h-20 group-hover:scale-105 transition-transform rounded-xl">
            <span className="flex items-center gap-3">
              <GalleryHorizontalEnd className="w-6 h-6 opacity-80" />
              <span className="vintage-text-strong text-lg">LA BARAJA</span>
            </span>
          </WoodButton>
        </Link>
      </motion.div>
    </main>
  );
}
