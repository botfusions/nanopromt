const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const targetPath = path.join(__dirname, '../src/data/prompts.ts');

function unescape(text) {
    if (!text) return '';
    return text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');
}

function extractAll() {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');
    const prompts = new Map();

    // --- 1. Extract from Rendered HTML ---
    // Look for all items with data-id
    const dataIdRegex = /data-id="(\d+)"/g;
    let match;
    while ((match = dataIdRegex.exec(content)) !== null) {
        const id = match[1];
        if (prompts.has(id)) continue;

        // Find the boundary of this card (approximate)
        const start = match.index;
        const chunk = content.substring(start - 500, start + 5000);

        const titleMatch = chunk.match(/<h3[^>]*>.*?<span>([\s\S]*?)<\/span>.*?<\/h3>/) ||
            chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
        const title = titleMatch ? unescape(titleMatch[1].replace(/<[^>]*>/g, '')) : '';

        const promptMatch = chunk.match(/<div class="[^"]*font-mono[^"]*">([\s\S]*?)<\/div>/);
        let promptText = '';
        if (promptMatch) {
            promptText = promptMatch[1].replace(/<[^>]*>/g, '').trim();
            promptText = promptText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        }

        const descMatch = chunk.match(/<p class="[^"]*text-gray-800[^"]*">([\s\S]*?)<\/p>/);
        const description = descMatch ? unescape(descMatch[1].replace(/<[^>]*>/g, '')) : '';

        const authorMatch = chunk.match(/title="@([^"]+)"/);
        const author = authorMatch ? '@' + authorMatch[1] : 'Anonymous';

        const dateMatch = chunk.match(/<span class="[^"]*text-gray-500[^"]*">([\s\S]*?)<\/span>/);
        const date = dateMatch ? unescape(dateMatch[1]) : '';

        const images = [];
        const imgRegex = /src="([^"]+(?:cms-assets|\.jpg)[^"]*)"/g;
        let imgM;
        const imgRange = chunk.substring(0, 3000);
        while ((imgM = imgRegex.exec(imgRange)) !== null) {
            if (!images.includes(imgM[1])) images.push(imgM[1]);
        }

        if (id && title && promptText) {
            prompts.set(id, {
                id,
                title: unescape(title),
                prompt: unescape(promptText),
                summary: description,
                categories: ['Tümü'],
                author: unescape(author),
                date: unescape(date),
                images: images.slice(0, 2),
                featured: chunk.includes('lucide-zap')
            });
        }
    }
    console.log(`Phase 1 complete: ${prompts.size} prompts.`);

    // --- 2. Extract from RSC Hydration ---
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    const rscParts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        rscParts.push(match[1]);
    }
    const rscStream = unescape(rscParts.join(''));

    // Look for JSON-like structures in RSC
    const rscIdRegex = /"id"\s*:\s*"?(\d+)"?/g;
    while ((match = rscIdRegex.exec(rscStream)) !== null) {
        const id = match[1];
        if (prompts.has(id)) continue;

        const start = match.index;
        const chunk = rscStream.substring(start - 100, start + 3000);

        const titleMatch = chunk.match(/"title"\s*:\s*"([^"]+?)"/);
        const promptMatch = chunk.match(/"prompt"\s*:\s*"([\s\S]+?)"|"content"\s*:\s*"([\s\S]+?)"/);

        if (titleMatch && promptMatch) {
            const title = titleMatch[1];
            const pText = promptMatch[1] || promptMatch[2];

            const authorMatch = chunk.match(/"author"\s*:\s*\{"name"\s*:\s*"([^"]+)"/);
            const author = authorMatch ? authorMatch[1] : 'Anonymous';

            const summaryMatch = chunk.match(/"summary"\s*:\s*"([^"]+?)"/);
            const summary = summaryMatch ? summaryMatch[1] : '';

            prompts.set(id, {
                id,
                title: unescape(title),
                prompt: unescape(pText),
                summary: unescape(summary),
                categories: ['Tümü'],
                author: unescape(author),
                date: '',
                images: [],
                featured: chunk.includes('"featured":true')
            });
        }
    }

    console.log(`Phase 2 complete: Total ${prompts.size} prompts.`);

    const uniquePrompts = Array.from(prompts.values());

    // 3. Extract Categories
    const categoriesSet = new Set(['Tümü']);
    const catSearch = content.match(/categories=([\w-]+)/g);
    if (catSearch) {
        catSearch.forEach(c => {
            const name = c.split('=')[1];
            if (name !== 'all') categoriesSet.add(name);
        });
    }

    const categories = Array.from(categoriesSet);

    // 4. Generate Output
    const output = `
export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  summary?: string;
  categories: string[];
  author: string;
  date: string;
  images: string[];
  featured?: boolean;
}

export const CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const PROMPTS: Prompt[] = ${JSON.stringify(uniquePrompts, null, 2)};
`;

    fs.writeFileSync(targetPath, output);
    console.log(`Successfully saved ${uniquePrompts.length} prompts to ${targetPath}`);
}

extractAll();
