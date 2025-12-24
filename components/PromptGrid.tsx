import { Prompt } from "@/src/data/prompts";
import { PromptCard } from "./PromptCard";

interface PromptGridProps {
    prompts: Prompt[];
    favorites: string[];
    onToggleFavorite: (id: string) => void;
}

export function PromptGrid({ prompts, favorites, onToggleFavorite }: PromptGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {prompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isFavorite={favorites.includes(prompt.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
}
