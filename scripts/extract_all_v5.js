const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const targetPath = path.join(__dirname, '../src/data/prompts.ts');

function unescapeRsc(text) {
    if (!text) return '';
    return text
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}

function extractAll() {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');

    // 1. Extract all RSC payload strings
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    const parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }

    console.log(`Found ${parts.length} RSC payloads.`);
    const fullStream = parts.join('');

    // 2. Unescape the stream
    // RSC payloads are often double-escaped or have special markers
    const unescapedStream = unescapeRsc(fullStream);
    const unescapedFullContent = unescapeRsc(content);
    const searchSpace = unescapedStream + unescapedFullContent;

    console.log('Search space length:', searchSpace.length);

    // 3. Search for prompt objects with varying structures
    const prompts = new Map();

    // Look for patterns like: {"id":..., "title":..., "prompt":...}
    // or: id:..., title:..., prompt:...
    // We'll use a very loose regex for fields
    const fields = ['id', 'title', 'prompt', 'categories', 'author', 'date', 'images', 'featured'];

    // Strategy: find all "id" markers and then look for associated fields in a window
    const idRegex = /"id"\s*:\s*"?([\w-]+)"?/g;

    while ((match = idRegex.exec(searchSpace)) !== null) {
        const id = match[1];
        if (id.length < 1) continue;

        const start = match.index;
        const windowSize = 3000;
        const chunk = searchSpace.substring(start - 500, start + windowSize);

        // Check if this chunk has enough fields to be a prompt
        const titleMatch = chunk.match(/"title"\s*:\s*"([^"]+?)"/);
        const promptMatch = chunk.match(/"prompt"\s*:\s*"([\s\S]+?)"|"content"\s*:\s*"([\s\S]+?)"/);

        if (titleMatch && promptMatch) {
            const title = titleMatch[1];
            const pContent = promptMatch[1] || promptMatch[2];

            // Extract categories
            let categories = ['Tümü'];
            const catMatch = chunk.match(/"categories"\s*:\s*\[([\s\S]*?)\]/);
            if (catMatch) {
                const individualCats = catMatch[1].match(/"([^"]+)"/g);
                if (individualCats) {
                    categories = [...new Set(['Tümü', ...individualCats.map(c => c.replace(/"/g, ''))])];
                }
            }

            // Extract items to deduplicate properly
            const authorMatch = chunk.match(/"author"\s*:\s*\{"name"\s*:\s*"([^"]+)"/);
            const author = authorMatch ? authorMatch[1] : 'Anonymous';

            const dateMatch = chunk.match(/"date"\s*:\s*"([^"]+)"/);
            const date = dateMatch ? dateMatch[1] : 'Nov 20, 2025';

            const images = [];
            const imgRegex = /"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/gi;
            let imgMatch;
            const imgRange = chunk.substring(0, 1500);
            while ((imgMatch = imgRegex.exec(imgRange)) !== null) {
                if (!images.includes(imgMatch[1]) && !imgMatch[1].includes('avatar')) {
                    images.push(imgMatch[1]);
                }
            }

            if (!prompts.has(id) || prompts.get(id).prompt.length < pContent.length) {
                prompts.set(id, {
                    id,
                    title: title.trim(),
                    prompt: pContent.trim(),
                    categories,
                    author: author,
                    date: date,
                    images: images.slice(0, 4),
                    featured: chunk.includes('"featured":true') || chunk.includes('"isFeatured":true')
                });
            }
        }
    }

    const uniquePrompts = Array.from(prompts.values());
    console.log(`Extracted ${uniquePrompts.length} unique prompts.`);

    // 4. Generate Output
    const categoriesSet = new Set(['Tümü']);
    uniquePrompts.forEach(p => p.categories.forEach(c => categoriesSet.add(c)));
    const categories = Array.from(categoriesSet);

    const output = `
export interface Prompt {
  id: string;
  title: string;
  prompt: string;
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
