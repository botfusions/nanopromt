import { Crop, Shuffle, Sparkles, ChevronDown } from "lucide-react";

export function PromptInput() {
    return (
        <div className="w-full max-w-4xl mx-auto bg-white border-2 border-brand-black shadow-neo-strong p-1 md:p-2 relative -mt-10 z-20 mb-12">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-grow relative bg-[#F8F9FA] border border-brand-black p-4 flex flex-col">
                    <textarea
                        placeholder="Oluşturmak istediğiniz görseli açıklayın... (örn: geceleyin bir siberpunk şehri)"
                        className="w-full h-[100px] bg-transparent border-none outline-none resize-none text-lg font-mono placeholder:text-gray-400"
                        style={{ caretColor: "transparent" }}
                    ></textarea>

                    <div className="mt-auto pt-4 flex items-center gap-3">
                        {/* Auto Button */}
                        <button className="bg-white border-2 border-brand-black px-2 py-1.5 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer flex items-center gap-2">
                            <Crop className="w-4 h-4 text-brand-black flex-shrink-0" />
                            <span className="font-black text-sm uppercase text-brand-black">
                                Otomatik
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-75" />
                        </button>

                        {/* Random Button */}
                        <button className="bg-white border-2 border-brand-black px-2 py-1.5 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover transition-all cursor-pointer flex items-center gap-2 hover:bg-brand-yellow group">
                            <Shuffle className="w-4 h-4 text-brand-black group-hover:rotate-180 transition-transform duration-300" />
                            <span className="font-black text-sm uppercase text-brand-black hidden sm:inline">
                                Rastgele
                            </span>
                        </button>
                    </div>
                </div>

                {/* Generate Button */}
                <button className="flex-shrink-0 md:w-32 bg-brand-black text-white font-black text-xl uppercase flex md:flex-col items-center justify-center gap-2 hover:bg-brand-red hover:text-brand-black border border-transparent hover:border-brand-black transition-all p-4 shadow-[2px_2px_0px_0px_rgba(128,128,128,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                    <Sparkles className="w-8 h-8" />
                    <span>Oluştur</span>
                </button>
            </div>
        </div>
    );
}
