"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CARDS } from "@/data/cards";
import { PlayingCard } from "@/components/ui/PlayingCard";
import { CornerOrnaments } from "@/components/ui/CornerOrnaments";
import { WoodButton } from "@/components/ui/WoodButton";
import { Bean } from "@/components/ui/Bean";
import { Heart, HeartOff, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Game Constants ---
const BOARD_SIZE = 9; // 3x3
const CARD_DURATION = 10000; // 10 seconds per card

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function GamePage() {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);

    const [lives, setLives] = useState(3);
    const [deck, setDeck] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [board, setBoard] = useState<Card[]>([]);
    const [beans, setBeans] = useState<Set<number>>(new Set()); // Indices of baord cells with beans
    const [shakenCell, setShakenCell] = useState<number | null>(null);

    // --- Initialization ---
    const startGame = useCallback(() => {
        const shuffled = shuffle(CARDS);
        setBoard(shuffled.slice(0, BOARD_SIZE));
        setDeck(shuffle(CARDS));
        setCurrentCardIndex(-1);
        setLives(3);
        setLives(3);
        setBeans(new Set());
        setCompletedLines(new Set());
        setVictory(false);
        setGameOver(false);
        setIsPlaying(true);
    }, []);

    useEffect(() => {
        startGame();
    }, [startGame]);

    // --- Penalization Logic ---
    const checkMissedCard = useCallback((cardIndex: number) => {
        if (cardIndex < 0 || cardIndex >= deck.length) return;

        const card = deck[cardIndex];
        const boardIndex = board.findIndex(c => c.id === card.id);

        // If card is on board AND not marked (no bean)
        if (boardIndex !== -1 && !beans.has(boardIndex)) {
            toast.error(`¡Se te pasó "${card.title}"! Pierdes vida, pero te la marcamos.`, {
                style: { backgroundColor: '#3e2723', color: '#f4e4bc', border: '2px solid #5d4037' }
            });

            // Auto-mark the missed card so player isn't blocked from winning
            setBeans(prev => {
                const newBeans = new Set(prev);
                newBeans.add(boardIndex);
                return newBeans;
            });

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    setIsPlaying(false);
                }
                return newLives;
            });
        }
    }, [deck, board, beans]);

    // --- Next Card Logic ---
    const advanceCard = useCallback((ignorePenalty = false) => {
        if (!isPlaying || gameOver || victory) return;

        // Check if player missed the CURRENT card before moving to next
        // Only check if we are NOT ignoring penalty (e.g. valid match)
        if (!ignorePenalty) {
            checkMissedCard(currentCardIndex);
        }

        setCurrentCardIndex(prev => {
            if (prev >= deck.length - 1) {
                // Deck finished
                return prev;
            }
            return prev + 1;
        });
    }, [isPlaying, gameOver, victory, currentCardIndex, checkMissedCard, deck.length]);

    // --- Game Loop & Dynamic Difficulty ---
    // Calculate duration: Starts at 10s, decreases by 150ms per card, floor at 3.5s
    const currentDuration = Math.max(3500, CARD_DURATION - (currentCardIndex * 150));

    useEffect(() => {
        if (!isPlaying || gameOver || victory) return;

        // Use setTimeout for variable duration
        const timer = setTimeout(() => {
            advanceCard();
        }, currentDuration);

        return () => clearTimeout(timer);
    }, [isPlaying, gameOver, victory, currentCardIndex, advanceCard, currentDuration]);

    const currentCard = currentCardIndex >= 0 ? deck[currentCardIndex] : null;

    // --- Win Logic ---
    const [completedLines, setCompletedLines] = useState<Set<string>>(new Set());

    // --- Line & Win Logic ---
    const checkLinesAndWin = useCallback((currentBeans: Set<number>) => {
        // 1. Check Blackout (Win)
        if (currentBeans.size === BOARD_SIZE) {
            setVictory(true);
            setIsPlaying(false);
            // Victory toast removed in favor of Overlay message
            return true;
        }

        // 2. Check for NEW lines (Rows/Cols) logic
        const lines = [
            { id: 'row-0', indices: [0, 1, 2] },
            { id: 'row-1', indices: [3, 4, 5] },
            { id: 'row-2', indices: [6, 7, 8] },
            { id: 'col-0', indices: [0, 3, 6] },
            { id: 'col-1', indices: [1, 4, 7] },
            { id: 'col-2', indices: [2, 5, 8] },
        ];

        let newLineFound = false;

        lines.forEach(line => {
            if (!completedLines.has(line.id) && line.indices.every(idx => currentBeans.has(idx))) {
                newLineFound = true;
                setCompletedLines(prev => {
                    const newSet = new Set(prev);
                    newSet.add(line.id);
                    return newSet;
                });
                toast.success("¡Línea completada! ¡Sigue así! 👏");
            }
        });

        return false;
    }, [completedLines]);

    // --- Interaction ---
    const handleCellClick = (card: Card, index: number) => {
        if (gameOver || victory || !currentCard) return;
        if (beans.has(index)) return; // Already marked

        if (card.id === currentCard.id) {
            // Correct Match!
            const newBeans = new Set(beans);
            newBeans.add(index);
            setBeans(newBeans);

            if (!checkLinesAndWin(newBeans)) {
                // Auto-advance if not win, small delay for visual feedback
                // Pass true to ignore penalty check because we JUST matched it
                setTimeout(() => advanceCard(true), 500);
            }
        } else {
            // Wrong!
            setShakenCell(index);
            setTimeout(() => setShakenCell(null), 500);

            // Immediate Penalty
            toast.error("¡Carta incorrecta! Pierdes una vida.", {
                style: { backgroundColor: '#3e2723', color: '#f4e4bc', border: '2px solid #5d4037' }
            });
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    setIsPlaying(false);
                }
                return newLives;
            });
        }
    };

    return (
        <main className="min-h-screen flex flex-col p-2 max-w-5xl mx-auto relative overflow-hidden">
            <CornerOrnaments />

            {/* Top Bar */}
            <div className="flex items-center justify-between h-20 w-full z-20 px-2 mt-2">
                <Link href="/">
                    <button className="bg-[#5d4037] p-3 rounded-xl border-4 border-[#3e2723] text-white shadow-xl active:scale-95 transition-transform">
                        <Home size={28} />
                    </button>
                </Link>

                {/* Lives Container - Framed */}
                <div className="flex gap-2 bg-[#d7c598] p-2 px-4 rounded-xl border-4 border-[#3e2723] shadow-lg wood-texture transform rotate-1">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="bg-[#3e2723] p-1 rounded-md border border-[#8d6e63] shadow-inner"
                            animate={{ scale: i <= lives ? 1 : 0.8, opacity: i <= lives ? 1 : 0.5 }}
                        >
                            <Heart className={cn("w-6 h-6 sm:w-8 sm:h-8", i <= lives ? "fill-red-600 stroke-red-900" : "fill-stone-700 stroke-stone-800")} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Responsive Layout */}
            <div className="flex-1 flex flex-col lg:flex-row-reverse items-center justify-center gap-8 w-full z-10 p-4">

                {/* Caller / Deck Section */}
                <div className="flex flex-col items-center justify-center gap-4 min-h-[300px] relative lg:w-1/2">
                    <AnimatePresence mode="wait">
                        {currentCard ? (
                            <motion.div
                                key={currentCard.id}
                                initial={{ scale: 0.5, opacity: 0, y: -50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, x: -100 }}
                                className="relative z-10"
                            >
                                <PlayingCard card={currentCard} className="w-64 lg:w-80 shadow-2xl skew-x-1" />
                            </motion.div>
                        ) : (
                            <div className="w-56 h-[min(350px,40vh)] flex items-center justify-center bg-[#f0e6d2] border-8 border-[#3e2723] rounded-lg opacity-80 shadow-xl wood-texture">
                                <span className="font-display text-2xl animate-pulse text-[#3e2723]">...</span>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Controls & Timer */}
                    <div className="flex flex-col gap-4 w-64 lg:w-80">
                        {/* Timer Bar */}
                        {isPlaying && (
                            <div className="w-full h-4 bg-[#3e2723] rounded-full overflow-hidden border-2 border-[#5d4037] shadow-inner">
                                <motion.div
                                    key={currentCardIndex}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: currentDuration / 1000, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-red-700 to-amber-600"
                                />
                            </div>
                        )}

                        {/* Next Button */}
                        <WoodButton
                            onClick={() => advanceCard(false)}
                            className="w-full py-4 text-xl flex items-center justify-center gap-2"
                            disabled={!isPlaying || gameOver}
                        >
                            <RotateCcw className="w-5 h-5 rotate-180" /> SIGUIENTE
                        </WoodButton>
                    </div>
                </div>

                {/* Player Board Section */}
                <div className="w-full max-w-md lg:max-w-xl relative lg:w-1/2 flex items-center justify-center">
                    {/* Board Container using refined wood-frame - Adjusted size behavior */}
                    <div className="relative p-2 bg-[#3e2723] rounded-xl shadow-2xl wood-frame inline-block">
                        <div className="grid grid-cols-3 gap-1 bg-[#3e2723] p-1 rounded-lg">
                            {board.map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    className={cn(
                                        "relative aspect-[2/3] w-24 sm:w-28 lg:w-32 flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none border border-[#8d6e63]/40 transition-all duration-200 rounded-sm",
                                        // Use vintage-paper logic for cells
                                        "bg-[#f9f3e5] hover:bg-[#fff9ea] active:bg-[#e0d6c2]",
                                        shakenCell === idx && "animate-shake bg-red-100",
                                        // Highlight if marked
                                        beans.has(idx) && "border-4 border-amber-600 shadow-inner"
                                    )}
                                    onClick={() => handleCellClick(card, idx)}
                                    whileTap={{ scale: 0.98 }}
                                    animate={shakenCell === idx ? { x: [-5, 5, -5, 5, 0] } : {}}
                                >
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                                    />

                                    {beans.has(idx) && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                            <Bean />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Over / Victory Overlays */}
            <AnimatePresence>
                {(victory || gameOver) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    >
                        <div className="bg-[#f4e4bc] border-4 border-[#3e2723] rounded-xl p-8 flex flex-col items-center gap-6 max-w-sm w-full text-center shadow-2xl wood-texture relative">
                            <div className="absolute inset-0 border-2 border-[#5d4037] m-2 rounded-lg pointer-events-none opacity-50" />

                            <h2 className="text-5xl font-display text-[#3e2723] drop-shadow-md z-10">
                                {victory ? "¡TEMPO!" : "¡LÁSTIMA!"}
                            </h2>
                            <p className="text-xl font-body font-bold text-[#5d4037] z-10 w-full px-4">
                                {victory ? "¡FELICIDADES! ¡TABLERO LLENO! 🎉" : "Se acabaron las vidas."}
                            </p>

                            <div className="w-full space-y-3 z-10">
                                <WoodButton onClick={startGame} className="w-full text-lg">
                                    <RotateCcw className="w-5 h-5" /> REINTENTAR
                                </WoodButton>
                                <Link href="/" className="w-full block">
                                    <WoodButton className="w-full bg-[#3e2723] text-[#f4e4bc] border-[#d7c598]">
                                        <Home className="w-5 h-5" /> SALIR
                                    </WoodButton>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
