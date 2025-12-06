"use client";

import { WoodButton } from "@/components/ui/WoodButton";
import { WoodSign } from "@/components/ui/WoodSign";
import { MoveLeft, Ear, ScanEye, Bean, Trophy, HeartOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RulesPage() {
    const steps = [
        {
            icon: <ScanEye className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-wood-dark)]" />,
            text: "1. Mira y Elige.",
            desc: "Sin audio por ahora. Observa la carta que sale y búscala."
        },
        {
            icon: <Ear className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-wood-dark)]" />,
            text: "2. ¡Acelera!",
            desc: "Empiezas con 10s. Cada carta reduce el tiempo. ¡Terminarás corriendo!"
        },
        {
            icon: <HeartOff className="w-8 h-8 md:w-10 md:h-10 text-red-800" />,
            text: "3. Castigo Inmediato.",
            desc: "¿Clic incorrecto? Pierdes vida. ¿Se te pasó? Pierdes vida y te la marca."
        },
        {
            icon: <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-wood-dark)]" />,
            text: "4. Tablero Lleno.",
            desc: "Para ganar, debes llenar las 9 casillas. ¡Blackout!"
        }
    ];

    return (
        <main className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden">
            <Link href="/" className="self-start mb-2 z-20">
                <WoodButton className="h-12 px-6 text-lg w-auto">
                    <MoveLeft className="w-6 h-6 mr-2" />
                    VOLVER
                </WoodButton>
            </Link>

            <div className="relative w-full max-w-xl mx-auto flex-1 flex flex-col items-center z-10 mt-4">
                <WoodSign text="LAS REGLAS" className="mb-[-20px] relative z-20 scale-90 sm:scale-100" />

                {/* Scroll Top Roller */}
                <div className="w-[110%] h-12 bg-[#d7c598] rounded-full border-4 border-[#3e2723] shadow-lg relative z-10 wood-texture flex items-center justify-between px-2">
                    <div className="w-8 h-8 rounded-full bg-[#3e2723] shadow-inner" />
                    <div className="w-8 h-8 rounded-full bg-[#3e2723] shadow-inner" />
                </div>

                {/* Scroll Body */}
                <div className="w-full bg-[#f4e4bc] border-x-4 border-[#3e2723] p-6 pt-12 relative shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] mt-[-24px] mb-[-24px]">
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />

                    <div className="space-y-6 relative z-10">
                        <h2 className="text-3xl font-display text-center text-[#3e2723] opacity-80 mb-6">COMO JUGAR</h2>

                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="shrink-0 p-2 bg-[#e0d6c2] rounded-lg border-2 border-[#8d6e63] shadow-sm transform -rotate-2">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-display text-[#3e2723]">{step.text}</h3>
                                    <p className="text-[#5d4037] font-serif leading-tight">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Scroll Bottom Roller */}
                <div className="w-[110%] h-12 bg-[#d7c598] rounded-full border-4 border-[#3e2723] shadow-xl relative z-10 wood-texture flex items-center justify-between px-2">
                    <div className="w-8 h-8 rounded-full bg-[#3e2723] shadow-inner" />
                    <div className="w-8 h-8 rounded-full bg-[#3e2723] shadow-inner" />
                </div>
            </div>
        </main>
    );
}
