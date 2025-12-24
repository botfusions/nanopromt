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

    // 1. Extract all pushed data from Next.js scripts
    const pushedData = [];
    const pushRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
    let match;
    while ((match = pushRegex.exec(content)) !== null) {
        pushedData.push(match[1]);
    }

    const fullStream = pushedData.join('');
    const unescapedStream = unescape(fullStream);
    const unescapedFullContent = unescape(content);

    // Combine both just in case
    const searchSpace = unescapedStream + unescapedFullContent;

    console.log('Search space length:', searchSpace.length);

    // 2. Find all prompt-like objects
    // We look for objects that have an id, title, and prompt/content
    // The structure seems to be variably nested, so we'll look for key fields
    const prompts = new Map();
    const idRegex = /"id"\s*:\s*"([^"]+)"|"id"\s*:\s*(\d+)/g;

    let idMatch;
    while ((idMatch = idRegex.exec(searchSpace)) !== null) {
        const id = idMatch[1] || idMatch[2];
        const startPos = idMatch.index;

        // Find the boundary of the object containing this ID
        // We'll look for a reasonably sized chunk around it and try to extract fields
        const chunk = searchSpace.substring(startPos - 500, startPos + 2000);

        const titleMatch = chunk.match(/"title"\s*:\s*"([^"]+?)"/);
        const promptMatch = chunk.match(/"prompt"\s*:\s*"([\s\S]+?)"|"content"\s*:\s*"([\s\S]+?)"/);

        if (titleMatch && (promptMatch)) {
            const title = titleMatch[1];
            const promptContent = promptMatch[1] || promptMatch[2];

            // Extract categories
            let categories = ['Tümü'];
            const catMatch = chunk.match(/"categories"\s*:\s*\[([\s\S]*?)\]/);
            if (catMatch) {
                const catStr = catMatch[1];
                const individualCats = catStr.match(/"([^"]+)"/g);
                if (individualCats) {
                    categories = [...new Set(['Tümü', ...individualCats.map(c => c.replace(/"/g, ''))])];
                }
            }

            // Extract images
            const images = [];
            const imgRegex = /"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi;
            let imgMatch;
            const imgRange = chunk.substring(0, 1000); // Look in a smaller range for images associated with this prompt
            while ((imgMatch = imgRegex.exec(imgRange)) !== null) {
                if (!images.includes(imgMatch[1])) {
                    images.push(imgMatch[1]);
                }
            }

            // Extract author
            const authorMatch = chunk.match(/"author"\s*:\s*\{"name"\s*:\s*"([^"]+)"/);
            const author = authorMatch ? authorMatch[1] : 'Anonymous';

            const dateMatch = chunk.match(/"date"\s*:\s*"([^"]+)"/);
            const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();

            if (!prompts.has(id)) {
                prompts.set(id, {
                    id,
                    title: unescape(title),
                    prompt: unescape(promptContent),
                    categories,
                    author: unescape(author),
                    date,
                    images: images.slice(0, 2), // Take first 2 images
                    featured: chunk.includes('"featured":true') || chunk.includes('"isFeatured":true')
                });
            }
        }
    }

    const uniquePrompts = Array.from(prompts.values());
    console.log(`Extracted ${uniquePrompts.length} unique prompts.`);

    if (uniquePrompts.length === 0) {
        console.log('No prompts found. Checking for alternative keys...');
        // Try searching for "name" instead of "title" or "body" instead of "prompt"
    }

    // 3. Extract Categories
    const categoriesSet = new Set(['Tümü']);
    uniquePrompts.forEach(p => p.categories.forEach(c => categoriesSet.add(c)));
    const categories = Array.from(categoriesSet);

    // 4. Generate Output
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
