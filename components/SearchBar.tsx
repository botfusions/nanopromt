"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="relative group w-full max-w-md">
            <div className="absolute inset-0 bg-black translate-x-[3px] translate-y-[3px] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform"></div>
            <div className="relative bg-white border-2 border-black flex items-center h-[40px] px-3">
                <Search className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Prompt, başlık veya #00001 ara..."
                    className="w-full bg-transparent outline-none font-medium placeholder:text-gray-400 text-sm"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
