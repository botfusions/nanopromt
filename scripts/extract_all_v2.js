const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const outputPath = path.join(__dirname, '../src/data/prompts.ts');

try {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');

    // We are looking for the prompted data. 
    // It's likely in a large JSON-like structure within Next.js stream calls.
    // Let's try to find all occurrences of "prompt":"

    const prompts = [];
    const categoriesSet = new Set(['Tümü']);

    // Pattern for the prompts in the Next.js data: 
    // They usually look like: {"id":"...","title":"...","prompt":"...","categories":["..."]}
    // However, in Next.js f-push, they are often escaped.

    // Let's use a simpler approach: Extract all JSON-like objects that have 'prompt' and 'title' keys.
    // This is robust against different Next.js versions.

    const promptRegex = /\{"id":"([^"]+)"[^{}]*?"title":"([^"]+)"[^{}]*?"prompt":"((?:[^"\\]|\\.)*?)"[^{}]*?"categories":\[([^\]]*?)\][^{}]*?\}/g;

    let match;
    while ((match = promptRegex.exec(content)) !== null) {
        const [full, id, title, promptText, catsRaw] = match;

        // Clean up categories
        const cardCategories = catsRaw
            .split(',')
            .map(c => c.replace(/"/g, '').trim())
            .filter(c => c);

        if (cardCategories.length === 0) cardCategories.push('Tümü');
        cardCategories.forEach(c => categoriesSet.add(c));

        // Let's try to find image URLs associated with this. 
        // In the data, images are often in an array nearby.
        // We'll look for "images":["https..."] near this object.
        // For simplicity, if we can't find them in the same object, we'll look in a small window after.

        let images = [];
        const windowIdx = content.indexOf(']', match.index + full.length);
        const sub = content.substring(match.index, windowIdx + 1000);
        const imgMatches = sub.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp|gif)/gi) || [];
        images = [...new Set(imgMatches)].slice(0, 4); // Take first few unique images

        // Author and other info
        const authorMatch = sub.match(/"author":\{"name":"([^"]+)"[^{}]*?"handle":"([^"]+)"[^{}]*?"url":"([^"]*)"\}/);
        const author = authorMatch ? {
            name: authorMatch[1],
            handle: authorMatch[2],
            url: authorMatch[3],
            avatar: ""
        } : { name: "Unknown", handle: "unknown", avatar: "" };

        const dateMatch = sub.match(/"date":"([^"]+)"/);
        const date = dateMatch ? dateMatch[1] : "Dec 2024";

        const summaryMatch = sub.match(/"summary":"((?:[^"\\]|\\.)*?)"/);
        const summary = summaryMatch ? summaryMatch[1].replace(/\\"/g, '"') : title;

        // Dedup by prompt text or ID
        if (!prompts.some(p => p.prompt === promptText)) {
            prompts.push({
                id: id,
                title: title.replace(/\\"/g, '"'),
                description: promptText.replace(/\\"/g, '"'),
                prompt: promptText.replace(/\\"/g, '"'),
                images: images,
                categories: cardCategories,
                author: author,
                date: date,
                featured: full.includes('"featured":true'),
                summary: summary
            });
        }
    }

    console.log(`Extracted ${prompts.length} unique prompts.`);

    if (prompts.length === 0) {
        console.warn('No prompts found with main regex. Trying secondary method...');
        // Fallback: If the JSON is too broken or escaped differently
        // We can just try to find pieces.
    }

    const fileContent = `export interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  images: string[];
  categories: string[];
  author: {
    name: string;
    handle: string;
    avatar: string;
    url?: string;
  };
  date: string;
  featured?: boolean;
  summary: string;
}

export const CATEGORIES = ${JSON.stringify(Array.from(categoriesSet), null, 2)};

export const PROMPTS: Prompt[] = ${JSON.stringify(prompts, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully saved to ${outputPath}`);

} catch (err) {
    console.error('Error during extraction:', err);
    process.exit(1);
}
