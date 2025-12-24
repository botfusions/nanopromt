"use client";

import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    return (
        <div className="sticky top-0 z-40 bg-bg-gray">
            <div className="container mx-auto px-4">
                <div className="flex justify-between gap-4 items-center py-3 md:py-4 border-b-4 border-brand-black">
                    {/* Main List Area */}
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <h2 className="text-2xl md:text-3xl font-black uppercase whitespace-nowrap block">
                            Yeni Promptlar
                        </h2>

                        <div className="flex-1 min-w-0 relative">
                            <div className="w-full overflow-x-auto scroll-smooth no-scrollbar touch-auto">
                                <div className="flex gap-2 py-1">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => onSelectCategory(category)}
                                            className={cn(
                                                "flex-shrink-0 px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap border-2 border-brand-black transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px]",
                                                selectedCategory === category
                                                    ? "bg-brand-yellow text-brand-black"
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Button */}
                    <button className="flex-shrink-0 flex items-center gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 text-xs font-bold uppercase border-2 border-brand-black bg-white text-gray-700 hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px]">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtrele</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
