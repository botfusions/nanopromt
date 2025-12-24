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
    console.log('Extracting from rendered HTML...');
    // regex for the card container and data-id
    const cardRegex = /<div class="group relative flex flex-col mt-12" data-id="(\d+)">([\s\S]*?)(?=<div class="group relative flex flex-col mt-12"|$)/g;
    let match;
    while ((match = cardRegex.exec(content)) !== null) {
        const id = match[1];
        const html = match[2];

        // Title: inside <h3><span>...</span></h3>
        const titleMatch = html.match(/<h3[^>]*>.*?<span>([\s\S]*?)<\/span>.*?<\/h3>/) ||
            html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
        const title = titleMatch ? unescape(titleMatch[1].replace(/<[^>]*>/g, '')) : '';

        // Prompt: looks for the font-mono div containing ```json or the prompt itself
        const promptMatch = html.match(/<div class="[^"]*font-mono[^"]*">([\s\S]*?)<\/div>/);
        let promptText = '';
        if (promptMatch) {
            promptText = promptMatch[1].replace(/<[^>]*>/g, '').trim();
            // Remove markdown code blocks if present
            promptText = promptText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        }

        // Description/Summary: usually in a <p> tag
        const descMatch = html.match(/<p class="[^"]*text-gray-800[^"]*">([\s\S]*?)<\/p>/);
        const description = descMatch ? unescape(descMatch[1].replace(/<[^>]*>/g, '')) : '';

        // Author: looks for the X.com handle or similar
        const authorMatch = html.match(/title="@([^"]+)"/);
        const author = authorMatch ? '@' + authorMatch[1] : 'Anonymous';

        // Date: looks for "2 days ago" or similar text near the author
        const dateMatch = html.match(/<span class="[^"]*text-gray-500[^"]*">([\s\S]*?)<\/span>/);
        const date = dateMatch ? unescape(dateMatch[1]) : '';

        // Images:
        const images = [];
        const imgRegex = /src="([^"]+)"/g;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(html)) !== null) {
            if (imgMatch[1].includes('cms-assets') || imgMatch[1].includes('.jpg')) {
                images.push(imgMatch[1]);
            }
        }

        if (id && title && promptText) {
            prompts.set(id, {
                id,
                title: unescape(title),
                prompt: unescape(promptText),
                summary: description,
                categories: ['Tümü'], // Will fix categories later
                author: unescape(author),
                date: unescape(date),
                images: images.slice(0, 2),
                featured: html.includes('lucide-zap') // Zap icon usually means featured/try now
            });
        }
    }
    console.log(`Extracted ${prompts.size} prompts from HTML.`);

    // --- 2. Extract from RSC Hydration ---
    console.log('Extracting from RSC hydration...');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    const rscParts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        rscParts.push(match[1]);
    }
    const rscStream = unescape(rscParts.join(''));

    // Look for JSON objects in RSC that look like prompts
    // Pattern: {"id":"123","title":"...","prompt":"..."}
    const rscPromptRegex = /"id"\s*:\s*"?(\d+)"?[\s\S]{1,100}"title"\s*:\s*"([^"]+?)"[\s\S]{1,200}"prompt"\s*:\s*"([\s\S]+?)"/g;
    while ((match = rscPromptRegex.exec(rscStream)) !== null) {
        const id = match[1];
        if (!prompts.has(id)) {
            prompts.set(id, {
                id,
                title: unescape(match[2]),
                prompt: unescape(match[3]),
                categories: ['Tümü'],
                author: 'Anonymous',
                date: '',
                images: [],
                featured: false
            });
        }
    }

    // Try another pattern for RSC (variations)
    const rscVariations = [
        /"id"\s*:\s*"([^"]+)"[\s\S]*?"title"\s*:\s*"([^"]+)"[\s\S]*?"content"\s*:\s*"([^"]+)"/,
        /"id"\s*:\s*(\d+)[\s\S]*?"title"\s*:\s*"([^"]+)"[\s\S]*?"prompt"\s*:\s*"([^"]+)"/
    ];

    rscVariations.forEach(r => {
        let m;
        const reg = new RegExp(r.source, 'g');
        while ((m = reg.exec(rscStream)) !== null) {
            const id = m[1];
            if (!prompts.size || !prompts.has(id)) {
                prompts.set(id, {
                    id,
                    title: unescape(m[2]),
                    prompt: unescape(m[3]),
                    categories: ['Tümü'],
                    author: 'Anonymous',
                    date: '',
                    images: [],
                    featured: false
                });
            }
        }
    });

    const uniquePrompts = Array.from(prompts.values());
    console.log(`Extracted total ${uniquePrompts.length} unique prompts.`);

    // 3. Extract Categories and clean up
    const categoriesSet = new Set(['Tümü']);
    // Try to find the category list in the file
    const catListMatch = content.match(/categories=([\w-]+)/g);
    if (catListMatch) {
        catListMatch.forEach(c => {
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
