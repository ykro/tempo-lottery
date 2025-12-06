import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeanProps {
    className?: string;
}

export function Bean({ className }: BeanProps) {
    return (
        <motion.div
            initial={{ scale: 2, opacity: 0, rotate: 180 }}
            animate={{ scale: 1, opacity: 1, rotate: Math.random() * 360 }}
            transition={{ type: "spring", damping: 12 }}
            className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none", className)}
        >
            {/* Simple SVG Bean */}
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg scale-125">
                <path d="M15 15C15 7 25 2 35 5C45 8 55 15 50 25C45 35 30 38 20 35C10 32 5 25 15 15Z" fill="#8D6E63" stroke="#3E2723" strokeWidth="2" />
                <path d="M25 15C28 12 35 15 32 20" stroke="#3E2723" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </svg>
        </motion.div>
    );
}
