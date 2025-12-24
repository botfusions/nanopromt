const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function scanRSCPatterns() {
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

    // Look for lines starting with digit:Letter
    const lineRegex = /^(\d+):([A-Z])([\s\S]*?)(?=\n\d+:[A-Z]|$)/gm;
    let lineMatch;
    let counts = {};
    let biggestLines = [];

    while ((lineMatch = lineRegex.exec(combined)) !== null) {
        const id = lineMatch[1];
        const tag = lineMatch[2];
        const body = lineMatch[3];
        counts[tag] = (counts[tag] || 0) + 1;

        if (body.length > 5000) {
            biggestLines.push({ id, tag, length: body.length, snippet: body.substring(0, 500) });
        }
    }

    console.log('Tag counts:', counts);
    console.log('Biggest lines:', biggestLines.map(l => ({ id: l.id, tag: l.tag, len: l.length })));

    biggestLines.forEach(l => {
        console.log(`\n--- Line ${l.id} (Tag ${l.tag}) ---`);
        console.log(l.snippet);
    });
}

scanRSCPatterns();
