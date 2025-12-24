"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Twitter,
    ExternalLink,
    Copy,
    Zap,
    Share2,
    Bookmark,
    Eye,
    Check
} from "lucide-react";
import { Prompt } from "@/src/data/prompts";
import { cn } from "@/lib/utils";

interface PromptCardProps {
    prompt: Prompt;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
}


export function PromptCard({ prompt, isFavorite, onToggleFavorite }: PromptCardProps) {
    const [activeTab, setActiveTab] = useState<"prompt" | "original">("prompt");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative flex flex-col mt-12 w-full">
            {/* Tabs - Positioned absolutely above the card */}
            <div className="absolute -top-10 left-0 flex z-0 group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-all duration-300 ease-in-out">
                <button
                    onClick={() => setActiveTab("prompt")}
                    className={cn(
                        "h-10 px-4 font-black text-sm border-t-4 border-l-4 border-r-4 border-brand-black uppercase relative transition-all duration-300 ease-in-out pb-1",
                        activeTab === "prompt"
                            ? "bg-white translate-y-[4px] z-20 border-b-0"
                            : "bg-gray-300 hover:bg-gray-200 translate-y-[8px] z-10 border-b-4 border-l-4"
                    )}
                >
                    Prompt
                </button>
                <button
                    onClick={() => setActiveTab("original")}
                    className={cn(
                        "h-10 px-4 font-black text-sm border-t-4 border-r-4 border-brand-black uppercase flex items-center gap-2 relative ml-[-4px] transition-all duration-300 ease-in-out",
                        activeTab === "original"
                            ? "bg-white translate-y-[4px] z-20 border-b-0"
                            : "bg-gray-300 hover:bg-gray-200 translate-y-[8px] z-10 border-b-4 border-l-4"
                    )}
                >
                    <Twitter className="w-4 h-4" />
                    Orijinal
                </button>
            </div>

            {/* Black Background Shadow Layer */}
            <div className="absolute inset-0 bg-brand-black translate-x-2 translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 z-0 transition-all duration-300 ease-in-out"></div>

            {/* Main Card Content */}
            <div className="relative z-10 bg-white border-4 border-brand-black p-4 md:p-6 flex flex-col group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-in-out">

                {/* Featured Tag */}
                {prompt.featured && (
                    <div className="absolute -right-4 -top-3 z-30 bg-brand-yellow text-brand-black border-2 border-brand-black px-3 py-1 shadow-neo rotate-6 font-black uppercase text-xs tracking-wider transform hover:rotate-0 transition-transform cursor-default">
                        Öne Çıkan
                    </div>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-2 mb-4 text-sm font-bold border-b-2 border-gray-200 pb-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                        <span className="flex-shrink-0 text-gray-500 uppercase text-xs">TARAFINDAN</span>
                        <span className="underline decoration-2 decoration-brand-black underline-offset-4 hover:bg-brand-yellow uppercase truncate">
                            {prompt.author}
                        </span>
                    </div>
                    <span className="flex-shrink-0 font-mono text-gray-500 whitespace-nowrap text-xs">
                        {prompt.date}
                    </span>
                </div>

                <div className="mb-4 border-2 border-brand-black shadow-neo overflow-hidden relative group/image">
                    <div className="aspect-video w-full relative">
                        <img
                            src={prompt.images[0]}
                            alt={prompt.title}
                            className="object-cover w-full h-full"
                        />
                        {/* "Original" Tab Overlay visual could go here if needed, but sticking to simpler implementation */}
                    </div>
                    <button className="absolute top-2 right-2 bg-white border-2 border-brand-black p-1.5 hover:bg-brand-yellow transition-all z-10 shadow-neo active:translate-x-[1px] active:translate-y-[1px] active:shadow-none opacity-0 group-hover/image:opacity-100 duration-200">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {/* Description - Using Prompt preview as description */}
                <p className="text-gray-800 font-medium mb-4 text-sm md:text-base leading-relaxed">
                    {prompt.prompt.substring(0, 150)}...
                </p>

                {/* Prompt/Code Block */}
                <div className="bg-[#F8F9FA] border-2 border-brand-black mb-6 h-40 relative flex flex-col group/prompt">
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-brand-black text-white px-2 py-0.5 text-xs font-bold uppercase z-20">
                        <span>{activeTab === 'prompt' ? 'Prompt' : 'Orijinal Tweet'}</span>
                    </div>

                    <div className="relative h-full w-full overflow-hidden pt-8">
                        <div className="h-full w-full overflow-y-auto px-4 pb-4 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed text-gray-600">
                            {activeTab === 'prompt' ? prompt.prompt : "Orijinal içerik için linke tıklayınız."}
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="absolute bottom-2 right-2 p-1.5 bg-white border-2 border-brand-black font-bold hover:bg-gray-100 shadow-neo active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all opacity-0 group-hover/prompt:opacity-90 z-30"
                        title="KOPYALA"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button className="flex-grow flex items-center justify-center gap-2 bg-brand-black border-2 border-brand-black py-2 px-4 font-bold text-white hover:bg-brand-red hover:text-brand-black hover:border-brand-black shadow-neo active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all uppercase text-sm md:text-base">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Şimdi dene</span>
                    </button>

                    <button className="flex items-center justify-center p-2 bg-white border-2 border-brand-black font-bold hover:bg-gray-100 shadow-neo active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onToggleFavorite(prompt.id)}
                        className={cn(
                            "flex items-center justify-center p-2 border-2 border-brand-black font-bold shadow-neo active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all",
                            isFavorite ? "bg-brand-red text-white" : "bg-white hover:bg-gray-100"
                        )}
                        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    >
                        <Bookmark className={cn("w-4 h-4", isFavorite && "fill-current")} />
                    </button>
                </div>

            </div>
        </div>
    );
}
