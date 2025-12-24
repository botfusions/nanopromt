import Link from "next/link";
import { Github, Languages, ChevronDown, HelpCircle } from "lucide-react";

export function Header() {
    return (
        <header className="bg-brand-red border-b-4 border-brand-black py-4 md:py-8 px-4 mb-4 md:mb-6 relative overflow-hidden w-full">
            {/* Logo Area */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 bg-white border-2 border-brand-black px-4 py-2 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer min-h-[2rem] flex items-center">
                <Link href="/" className="flex items-center gap-1.5 font-black text-xl tracking-tighter">
                    YOUMIND
                </Link>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-2">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-white border-2 border-brand-black p-2 min-h-[2rem] shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer"
                    title="GitHub"
                >
                    <Github className="w-5 h-5" />
                </a>

                <button className="bg-white border-2 border-brand-black p-2 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer flex items-center justify-center min-h-[2rem]">
                    <HelpCircle className="w-5 h-5 text-brand-black" />
                </button>

                <button className="flex items-center justify-between h-auto w-auto p-0 border-0 bg-transparent">
                    <div className="bg-white border-2 border-brand-black px-3 py-2 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer flex items-center gap-2 relative overflow-hidden min-h-[2rem]">
                        <Languages className="w-5 h-5 text-brand-black flex-shrink-0" />
                        <span className="font-black text-sm uppercase text-brand-black hidden sm:inline">
                            Türkçe
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-75 ml-1" />
                    </div>
                </button>
            </div>

            {/* Hero Title Area inside Header */}
            <div className="container mx-auto text-center pt-16 md:pt-10 pb-4 md:pb-6">
                <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 uppercase tracking-tighter text-white drop-shadow-[4px_4px_0_#000] leading-tight">
                    Botfusions NaNo<br />
                    <span className="inline-block mt-4 md:mt-6 relative">
                        <span className="text-brand-black bg-white px-4 border-4 border-brand-black">
                            Promptlar
                        </span>
                    </span>
                </h1>
            </div>
        </header>
    );
}
