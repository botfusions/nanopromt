const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');
const outputPath = path.join(__dirname, '../src/data/prompts.ts');

function unescapeHtml(text) {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}

function extractFromNextData(content) {
    const promptsMap = new Map();
    const categoriesSet = new Set(['Tümü']);

    // Look for all occurrences of JSON-like patterns that look like prompt objects
    // Typical prompt object: {"id":"...","title":"...","prompt":"...","categories":[...]}
    // We unescape first to make it easier
    const unescaped = unescapeHtml(content);

    // Regex to find things that look like our prompt objects
    // We'll search for "id":"..." and then find the surrounding { }
    const idRegex = /"id":"([^"]+)"/g;
    let match;

    while ((match = idRegex.exec(unescaped)) !== null) {
        const startIdx = unescaped.lastIndexOf('{', match.index);
        if (startIdx === -1) continue;

        // Simple brace counting to find the object end
        let braceCount = 0;
        let endIdx = -1;
        for (let i = startIdx; i < unescaped.length; i++) {
            if (unescaped[i] === '{') braceCount++;
            else if (unescaped[i] === '}') braceCount--;

            if (braceCount === 0) {
                endIdx = i + 1;
                break;
            }
        }

        if (endIdx === -1) continue;

        const objStr = unescaped.substring(startIdx, endIdx);
        try {
            // Only try to parse if it contains "prompt" and "title"
            if (objStr.includes('"prompt"') && objStr.includes('"title"')) {
                // We use a safe parse approach since it might be a partial or embedded JSON
                // Instead of JSON.parse (which might fail on complex nested Next.js data), 
                // let's use regex to grab the fields from this specific object block.

                const id = (objStr.match(/"id":"([^"]+)"/) || [])[1];
                const title = (objStr.match(/"title":"((?:[^"\\]|\\.)*?)"/) || [])[1];
                const prompt = (objStr.match(/"prompt":"((?:[^"\\]|\\.)*?)"/) || [])[1];
                const catsMatch = objStr.match(/"categories":\[([^\]]*?)\]/);
                const catsRaw = catsMatch ? catsMatch[1] : "";

                if (id && title && prompt) {
                    const categories = catsRaw
                        .split(',')
                        .map(c => c.replace(/"/g, '').trim())
                        .filter(c => c);

                    if (categories.length === 0) categories.push('Tümü');
                    categories.forEach(c => categoriesSet.add(c));

                    // Grab images
                    const imgMatches = objStr.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp|gif)/gi) || [];
                    const images = [...new Set(imgMatches)].slice(0, 4);

                    // Author
                    const authorName = (objStr.match(/"name":"([^"]+)"/) || [])[1] || "Unknown";
                    const authorHandle = (objStr.match(/"handle":"([^"]+)"/) || [])[1] || "unknown";

                    // Summary
                    const summary = (objStr.match(/"summary":"((?:[^"\\]|\\.)*?)"/) || [])[1] || title;

                    // Date
                    const date = (objStr.match(/"date":"([^"]+)"/) || [])[1] || "Dec 2024";

                    // Featured
                    const featured = objStr.includes('"featured":true');

                    if (!promptsMap.has(id)) {
                        promptsMap.set(id, {
                            id,
                            title: title.replace(/\\"/g, '"'),
                            description: prompt.replace(/\\"/g, '"'),
                            prompt: prompt.replace(/\\"/g, '"'),
                            images,
                            categories,
                            author: {
                                name: authorName,
                                handle: authorHandle,
                                avatar: ""
                            },
                            date,
                            featured,
                            summary: summary.replace(/\\"/g, '"')
                        });
                    }
                }
            }
        } catch (e) {
            // Skip broken objects
        }
    }

    return {
        prompts: Array.from(promptsMap.values()),
        categories: Array.from(categoriesSet)
    };
}

try {
    console.log('Reading source file...');
    const content = fs.readFileSync(sourcePath, 'utf8');

    const result = extractFromNextData(content);

    console.log(`Extracted ${result.prompts.length} unique prompts.`);
    console.log(`Categories found: ${result.categories.join(', ')}`);

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

export const CATEGORIES = ${JSON.stringify(result.categories, null, 2)};

export const PROMPTS: Prompt[] = ${JSON.stringify(result.prompts, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully saved to ${outputPath}`);

} catch (err) {
    console.error('Error during extraction:', err);
    process.exit(1);
}
