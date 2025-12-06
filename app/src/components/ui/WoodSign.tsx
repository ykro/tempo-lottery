import { cn } from "@/lib/utils";

interface WoodSignProps {
    text: string;
    className?: string;
}

export function WoodSign({ text, className }: WoodSignProps) {
    return (
        <div className={cn("relative w-full max-w-sm mx-auto flex items-center justify-center p-2 z-20", className)}>
            {/* Main Sign Body */}
            <div className="relative w-full aspect-[3/1] bg-[var(--color-wood-light)] border-4 border-[var(--color-wood-dark)] rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transform skew-x-[-2deg] rotate-[-1deg] wood-texture">

                {/* Inner Recess */}
                <div className="absolute inset-2 border-2 border-[var(--color-wood-dark)] rounded bg-[var(--color-wood-medium)] opacity-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />

                {/* Text */}
                <span className="relative z-10 font-display text-4xl vintage-text tracking-widest uppercase">
                    {text}
                </span>
            </div>

            {/* Decorative Side Pieces (Simulating 'carved' ends) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 w-4 h-12 bg-[var(--color-wood-dark)] rounded-l-md shadow-lg" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-4 h-12 bg-[var(--color-wood-dark)] rounded-r-md shadow-lg" />
        </div>
    );
}
