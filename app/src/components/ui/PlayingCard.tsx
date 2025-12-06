import { Card } from "@/data/cards";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlayingCardProps {
    card: Card;
    className?: string;
    isFlipped?: boolean; // For future game logic
}

export function PlayingCard({ card, className, isFlipped = false }: PlayingCardProps) {
    return (
        <div className={cn(
            "relative aspect-[2/3] w-64 wood-frame shadow-2xl overflow-hidden flex flex-col pointer-events-none select-none",
            "p-3", // Padding for the frame
            className
        )}>
            {/* Inner Content (The Paper Card) */}
            <div className="flex-1 flex flex-col vintage-paper rounded border border-[#3e2723]/20 relative overflow-hidden">
                {/* Inner Border */}
                <div className="absolute inset-2 border-2 border-[var(--color-wood-medium)] opacity-50 rounded pointer-events-none" />

                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center font-bold text-[var(--color-wood-dark)] z-10">
                    {card.id}
                </div>

                {/* Image Area */}
                <div className="flex-1 m-4 mt-8 bg-[#f4e4bc] border-2 border-[var(--color-wood-medium)] rounded relative overflow-hidden flex items-center justify-center p-2">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                    />
                </div>

                {/* Title */}
                <div className="h-10 flex items-center justify-center bg-transparent z-10">
                    <h3 className="font-display uppercase text-base sm:text-xl font-bold text-[var(--color-wood-dark)] tracking-wider">
                        {card.title}
                    </h3>
                </div>

                {/* Texture overlay (Optional additional noise, but vintage-paper has it) */}
                <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-10 bg-[#3e2723]" />
            </div> {/* End of Vintage Paper Inner */}
        </div>
    );
}
