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
    const dataIdRegex = /data-id="(\d+)"/g;
    let match;
    while ((match = dataIdRegex.exec(content)) !== null) {
        const id = match[1];
        const start = match.index;
        const chunk = content.substring(start, start + 5000);

        // Find Title: look for h3 content
        const titleMatch = chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
        let title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'No Title';
        title = unescape(title).replace(/```json/g, '').trim();

        // Find Prompt Content: look for font-mono or the biggest code-like block
        const promptMatch = chunk.match(/font-mono[^>]*>([\s\S]*?)<\/div>/);
        let promptText = promptMatch ? promptMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        promptText = promptText.replace(/^```json\s*/, '').replace(/```$/, '').trim();

        // Find Summary: look for text-gray-800
        const summaryMatch = chunk.match(/text-gray-800[^>]*>([\s\S]*?)<\/p>/);
        const summary = summaryMatch ? unescape(summaryMatch[1].replace(/<[^>]*>/g, '')).trim() : '';

        // Find Author
        const authorMatch = chunk.match(/title="@([^"]+)"|@([^<"]+)/);
        const author = authorMatch ? '@' + (authorMatch[1] || authorMatch[2]) : 'Anonymous';

        if (id && title) {
            prompts.set(id, {
                id,
                title: unescape(title),
                prompt: unescape(promptText) || summary || 'No Prompt Content Found',
                summary: summary,
                categories: ['Tümü'],
                author: unescape(author),
                date: 'Nov 20, 2025',
                images: [],
                featured: chunk.includes('lucide-zap')
            });
        }
    }
    console.log(`Phase 1: ${prompts.size} items.`);

    // --- 2. Extract from RSC ---
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    const rscParts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        rscParts.push(match[1]);
    }
    const rscStream = unescape(rscParts.join(''));

    // Very lenient RSC extraction
    const rscPromptRegex = /"id"\s*:\s*"?(\d+)"?[\s\S]{0,100}"title"\s*:\s*"([^"]+?)"/g;
    while ((match = rscPromptRegex.exec(rscStream)) !== null) {
        const id = match[1];
        if (!prompts.has(id)) {
            const start = match.index;
            const chunk = rscStream.substring(start, start + 3000);
            const promptMatch = chunk.match(/"prompt"\s*:\s*"([\s\S]+?)"|"content"\s*:\s*"([\s\S]+?)"/);
            const pContent = promptMatch ? promptMatch[1] || promptMatch[2] : 'RSC Hidden Content';

            prompts.set(id, {
                id,
                title: unescape(match[2]),
                prompt: unescape(pContent),
                categories: ['Tümü'],
                author: 'Anonymous',
                date: '',
                images: [],
                featured: false
            });
        }
    }
    console.log(`Total items: ${prompts.size}`);

    const uniquePrompts = Array.from(prompts.values());

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

extractAll();
