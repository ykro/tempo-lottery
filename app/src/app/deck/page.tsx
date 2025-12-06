"use client";

import { useState } from "react";
import { CARDS } from "@/data/cards";
import { PlayingCard } from "@/components/ui/PlayingCard";
import { WoodButton } from "@/components/ui/WoodButton";
import { WoodSign } from "@/components/ui/WoodSign";
import { MoveLeft, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DeckPage() {
    const [index, setIndex] = useState(0);

    const nextCard = () => setIndex((prev) => (prev + 1) % CARDS.length);
    const prevCard = () => setIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);

    return (
        <main className="min-h-screen flex flex-col items-center p-4 gap-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                {/* Simple gear shape */}
                <svg viewBox="0 0 100 100" className="w-[80vw] h-[80vw] animate-spin-slow">
                    <path d="M50 0 L60 10 L40 10 Z" fill="black" />
                    {/* ... Simplified for brevity, assuming CornerOrnaments handles most bg noise */}
                </svg>
            </div>

            <Link href="/" className="self-start z-20">
                <WoodButton className="h-12 w-auto px-4 text-lg">
                    <MoveLeft className="w-6 h-6 mr-2" />
                    VOLVER
                </WoodButton>
            </Link>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg relative z-10">
                <WoodSign text="LA BARAJA" className="mb-8" />

                <div className="relative h-[420px] w-full flex items-center justify-center perspective-1000">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50, rotateY: -10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -50, rotateY: 10 }}
                            transition={{ duration: 0.3 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                if (swipe < -50) {
                                    nextCard();
                                } else if (swipe > 50) {
                                    prevCard();
                                }
                            }}
                            className="cursor-grab active:cursor-grabbing touch-none"
                        >
                            <PlayingCard card={CARDS[index]} className="scale-110 shadow-2xl skew-x-1 pointer-events-none" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center gap-2 lg:gap-4 w-full px-2 lg:px-4">
                    <WoodButton onClick={prevCard} className="flex-1 text-xs sm:text-lg py-3 lg:py-4 px-2 lg:px-4 justify-center">
                        <ArrowLeft className="w-4 h-4 lg:w-6 lg:h-6 mr-1 lg:mr-2" /> <span className="hidden sm:inline">ANTERIOR</span><span className="sm:hidden">ATRÁS</span>
                    </WoodButton>

                    <div className="wood-frame px-3 lg:px-6 py-2 lg:py-3 bg-[#f4e4bc] min-w-[60px] lg:min-w-[100px] text-center transform -skew-x-6 shadow-md">
                        <span className="font-display text-lg lg:text-2xl text-[#3e2723]">{index + 1} / {CARDS.length}</span>
                    </div>

                    <WoodButton onClick={nextCard} className="flex-1 text-xs sm:text-lg py-3 lg:py-4 px-2 lg:px-4 justify-center">
                        <span className="hidden sm:inline">SIGUIENTE</span><span className="sm:hidden">SIG.</span> <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 ml-1 lg:ml-2" />
                    </WoodButton>
                </div>
            </div>
        </main>
    );
}
