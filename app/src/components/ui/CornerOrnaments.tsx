import { cn } from "@/lib/utils";

export function CornerOrnaments() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32">
                <Gear className="absolute top-2 left-2 w-12 h-12 text-[var(--color-wood-dark)] animate-spin-slow" />
                <Leaves className="absolute top-0 left-0 w-full h-full text-[#5d4037]" />
            </div>

            {/* Top Right */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 scale-x-[-1]">
                <Gear className="absolute top-2 left-2 w-12 h-12 text-[var(--color-wood-dark)] animate-spin-reverse-slow" />
                <Leaves className="absolute top-0 left-0 w-full h-full text-[#5d4037]" />
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 scale-y-[-1]">
                <Gear className="absolute top-2 left-2 w-12 h-12 text-[var(--color-wood-dark)] animate-spin-reverse-slow" />
                <Leaves className="absolute top-0 left-0 w-full h-full text-[#5d4037]" />
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 scale-[-1]">
                <Gear className="absolute top-2 left-2 w-12 h-12 text-[var(--color-wood-dark)] animate-spin-slow" />
                <Leaves className="absolute top-0 left-0 w-full h-full text-[#5d4037]" />
            </div>
        </div>
    );
}

// Simple Gear SVG
function Gear({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M21.8 13.4C21.9 12.9 22 12.5 22 12C22 11.5 21.9 11 21.8 10.6L19.5 10.2C19.3 9.7 19.1 9.2 18.8 8.7L19.9 6.8C19.6 6.3 19.2 5.8 18.8 5.4C18.4 5 17.9 4.6 17.5 4.3L15.6 5.4C15.1 5.1 14.6 4.9 14.1 4.7L13.7 2.4C13.2 2.3 12.8 2.2 12.3 2.2H11.7C11.2 2.2 10.7 2.3 10.3 2.4L9.9 4.7C9.3 4.9 8.8 5.1 8.3 5.4L6.5 4.3C6 4.6 5.6 5 5.2 5.4C4.8 5.8 4.4 6.3 4.1 6.8L5.2 8.7C4.9 9.2 4.7 9.7 4.5 10.2L2.2 10.6C2.1 11.1 2 11.5 2 12C2 12.5 2.1 12.9 2.2 13.4L4.5 13.8C4.7 14.3 4.9 14.8 5.2 15.3L4.1 17.2C4.4 17.7 4.8 18.2 5.2 18.6C5.6 19 6 19.4 6.5 19.7L8.3 18.6C8.8 18.9 9.3 19.1 9.9 19.3L10.3 21.6C10.7 21.7 11.2 21.8 11.7 21.8H12.3C12.8 21.8 13.2 21.7 13.7 21.6L14.1 19.3C14.6 19.1 15.1 18.9 15.6 18.6L17.5 19.7C17.9 19.4 18.4 19 18.8 18.6C19.2 18.2 19.6 17.7 19.9 17.2L18.8 15.3C19.1 14.8 19.3 14.3 19.5 13.8L21.8 13.4ZM12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" />
        </svg>
    )
}

// Decorative Leaves SVG (Corner)
function Leaves({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* Abstract leafy shapes */}
            <path d="M0 0 C40 10, 60 40, 50 100 C30 80, 10 30, 0 0 Z" opacity="0.8" />
            <path d="M0 0 C30 5, 40 20, 30 60 C20 40, 5 10, 0 0 Z" opacity="0.6" transform="rotate(15) translate(10, 10)" />
        </svg>
    )
}
