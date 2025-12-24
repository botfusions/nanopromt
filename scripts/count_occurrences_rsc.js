const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findPromptList() {
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

    // Search for a specific title that might be in the large list but not in the first 310
    // Actually, let's just count how many times "prompt" or "title" appears in the WHOLE stream
    const titleOccurrences = (combined.match(/"title":/g) || []).length;
    const promptOccurrences = (combined.match(/"prompt":/g) || []).length;
    const contentOccurrences = (combined.match(/"content":/g) || []).length;

    console.log(`"title": ${titleOccurrences}`);
    console.log(`"prompt": ${promptOccurrences}`);
    console.log(`"content": ${contentOccurrences}`);
}

findPromptList();
