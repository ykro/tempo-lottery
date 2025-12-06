import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface WoodButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    active?: boolean;
}

export function WoodButton({ children, className, active, ...props }: WoodButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95, y: 2 }}
            className={cn(
                "relative w-full max-w-sm px-8 py-3 my-2 text-xl font-display font-medium text-[#3e2723]",
                // Plank shape
                "bg-[#8d6e63] border-y-4 border-x-2 border-[#5d4037] rounded-lg",
                // Shadows & Depth
                "shadow-[0_4px_6px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)]",
                // Texture
                "wood-texture flex items-center justify-center gap-4",
                // Notches
                "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-8 before:bg-[#3e2723] before:rounded-r-sm before:opacity-60",
                "after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-8 after:bg-[#3e2723] after:rounded-l-sm after:opacity-60",
                className
            )}
            {...props}
        >
            {/* Screw Heads */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3e2723] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
                <div className="w-[1px] h-2 bg-[#5d4037]/50 rotate-45" />
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3e2723] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
                <div className="w-[1px] h-2 bg-[#5d4037]/50 rotate-45" />
            </div>

            {/* Content Text with drop shadow */}
            <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.3)] z-10">{children}</span>
        </motion.button>
    );
}
