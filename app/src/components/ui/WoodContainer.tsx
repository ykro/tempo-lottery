import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WoodContainerProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export function WoodContainer({ children, className, title }: WoodContainerProps) {
    return (
        <div className={cn(
            "relative p-6 bg-[var(--color-parchment-dark)] border-8 border-[var(--color-wood-dark)] rounded-xl",
            "shadow-[0_10px_20px_rgba(0,0,0,0.5)] wood-texture",
            className
        )}>
            {title && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-8 py-2 bg-[var(--color-wood-medium)] border-4 border-[var(--color-wood-dark)] rounded-lg shadow-md transform max-w-[90%] w-max text-center z-10">
                    <h2 className="text-2xl sm:text-3xl font-display text-white drop-shadow-md whitespace-nowrap">
                        {title}
                    </h2>
                </div>
            )}
            <div className="relative z-0 h-full w-full">
                {children}
            </div>
        </div>
    );
}
