const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const targetPath = path.join(__dirname, '../src/data/prompts.ts');

function unescapeRSC(text) {
    if (!text) return '';
    return text
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');
}

function extractAllV10() {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');
    const prompts = new Map();

    // 1. Extract from self.__next_f.push parts (RSC)
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    const unescapedCombined = unescapeRSC(parts.join(''));

    // 1a. Extract from :T markers (v9 logic)
    const tRegex = /:T([0-9a-f]+),([\s\S]*?)(?=:T[0-9a-f]+,|$)/g;
    let tMatch;
    let tCount = 0;
    while ((tMatch = tRegex.exec(unescapedCombined)) !== null) {
        const id = tMatch[1];
        const rawContent = tMatch[2].trim();
        const pieces = rawContent.split(',');
        const title = pieces[0] ? pieces[0].trim() : 'Unnamed Prompt';
        const promptText = pieces.slice(1).join(',').trim();

        if (title.length > 5 && !prompts.has(id)) {
            prompts.set(id, {
                id,
                title,
                prompt: promptText || title,
                categories: ['Tümü'],
                author: 'Anonymous',
                date: 'Dec 2025',
                images: [],
                featured: false
            });
            tCount++;
        }
    }
    console.log(`Phase 1: Extracted ${tCount} prompts from :T markers.`);

    // 2. Extract from JSON objects in RSC
    // Look for patterns like {"id":"...", "title":"...", "prompt":"..."}
    const jsonPromptRegex = /"id"\s*:\s*"(\d+)"[^}]*?"title"\s*:\s*"(.*?)"[^}]*?"prompt"\s*:\s*"(.*?)"/g;
    let jMatch;
    let jCount = 0;
    while ((jMatch = jsonPromptRegex.exec(unescapedCombined)) !== null) {
        const id = jMatch[1];
        const title = jMatch[2];
        const prompt = jMatch[3];
        if (!prompts.has(id)) {
            prompts.set(id, {
                id,
                title,
                prompt,
                categories: ['Tümü'],
                author: 'Anonymous',
                date: 'Dec 2025',
                images: [],
                featured: false
            });
            jCount++;
        }
    }
    console.log(`Phase 2: Extracted ${jCount} additional prompts from JSON objects.`);

    // 3. Extract from raw HTML data-id (fallback/verification)
    const dataIdRegex = /data-id="(\d+)"/g;
    let hMatch;
    let hCount = 0;
    while ((hMatch = dataIdRegex.exec(content)) !== null) {
        const id = hMatch[1];
        if (!prompts.has(id)) {
            // If it's in HTML but we haven't caught it, it means it's rendered but not in our RSC parser.
            // This is unlikely to give much info without full HTML parsing, but let's log it.
            hCount++;
        }
    }
    console.log(`Phase 3: Found ${hCount} prompts in HTML not yet in collection.`);

    const uniquePrompts = Array.from(prompts.values());
    console.log(`Total unique prompts: ${uniquePrompts.length}`);

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

export const CATEGORIES = ["Tümü", "Sosyal Medya", "Profil / Avatar"];

export const PROMPTS: Prompt[] = ${JSON.stringify(uniquePrompts, null, 2)};
`;

    fs.writeFileSync(targetPath, output);
    console.log(`Successfully saved ${uniquePrompts.length} prompts to ${targetPath}`);
}

extractAllV10();
