
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'src/data/all_prompts.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const prompts = JSON.parse(rawData);

const koreanChineseRegex = /[\u3131-\uD79D\u4e00-\u9fff]/;

const getPromptFromOriginal = (p) => {
    if (p.prompt_original && typeof p.prompt_original === 'string') {
        try {
            const parsed = JSON.parse(p.prompt_original);
            return parsed.prompt || "";
        } catch {
            return "";
        }
    }
    return p.prompt_original?.prompt || "";
};

// 1. Görünen ama resimsiz olan ilk 3 promptu bul (birini zaten yaptık)
const targetPrompts = prompts.filter(p => {
    const promptText = p.prompt_en || p.prompt || getPromptFromOriginal(p) || p.prompt_cn || p.title || "";
    const isKoreanChinese = koreanChineseRegex.test(promptText);

    if (isKoreanChinese) return false;

    const images = p.images || [];
    const firstImage = images[0];
    const hasWorkingImage = Boolean(
        firstImage &&
        typeof firstImage === 'string' &&
        firstImage.startsWith('http') &&
        !firstImage.includes('placeholder') &&
        firstImage.length > 10
    );

    return !hasWorkingImage;
}).slice(0, 5); // Take 5 just in case some fail or were already done

targetPrompts.forEach(p => {
    const finalPromptText = p.prompt_en || p.prompt || getPromptFromOriginal(p) || p.title || "";
    console.log(`ID:${p.id}`);
    console.log(`TEXT:${finalPromptText.replace(/\n/g, ' ')}`);
    console.log('---');
});
