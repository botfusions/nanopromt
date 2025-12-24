const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function scanITags() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    let combined = parts.join('');
    combined = combined
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');

    const lineRegex = /^(\d+):I([\s\S]*?)(?=\n\d+:[A-Z]|$)/gm;
    let lineMatch;

    while ((lineMatch = lineRegex.exec(combined)) !== null) {
        console.log(`Tag I (ID ${lineMatch[1]}): ${lineMatch[2].length} chars.`);
        console.log(`Snippet: ${lineMatch[2].substring(0, 500)}`);
    }
}

scanITags();
