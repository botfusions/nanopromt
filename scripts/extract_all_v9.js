const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const targetPath = path.join(__dirname, '../src/data/prompts.ts');

function extractPromptsV9() {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    let combined = parts.join('');
    // Unescape once
    combined = combined
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');

    console.log('Extracting from RSC :T format...');
    // Pattern: :T[id],[title],[description]? maybe?
    // Based on inspection, it looks like :T[id],[text] where text can be complex.
    // However, the context showed something like:
    // :T542,portreli ve çince/i̇ngilizce kişiselleştirmeli...

    const prompts = [];
    const tRegex = /:T([0-9a-f]+),([\s\S]*?)(?=:T[0-9a-f]+,|$)/g;
    let tMatch;

    while ((tMatch = tRegex.exec(combined)) !== null) {
        const id = tMatch[1];
        const rawContent = tMatch[2].trim();

        // Split by comma if it's a simple list, but it's probably not.
        // Let's try to extract title and description.
        // Usually, the title is the first part.
        const pieces = rawContent.split(',');
        const title = pieces[0] ? pieces[0].trim() : 'Unnamed Prompt';
        const promptText = pieces.slice(1).join(',').trim();

        if (title.length > 5) { // Filter out garbage
            prompts.push({
                id: id,
                title: title,
                prompt: promptText || title,
                categories: ['Tümü'],
                author: 'Anonymous',
                date: 'Dec 2025',
                images: [],
                featured: false
            });
        }
    }

    console.log(`Extracted ${prompts.length} prompts from RSC.`);

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

export const PROMPTS: Prompt[] = ${JSON.stringify(prompts, null, 2)};
`;

    fs.writeFileSync(targetPath, output);
    console.log(`Successfully saved ${prompts.length} prompts to ${targetPath}`);
}

extractPromptsV9();
