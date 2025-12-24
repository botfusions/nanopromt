const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectLastT() {
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

    const tRegex = /:T[0-9a-f]+,/g;
    let tMatch;
    let lastMatch;
    while ((tMatch = tRegex.exec(combined)) !== null) {
        lastMatch = tMatch;
    }

    if (lastMatch) {
        console.log(`Last :T at ${lastMatch.index}: ${lastMatch[0]}`);
        console.log(`Context after: ${combined.substring(lastMatch.index, lastMatch.index + 2000)}`);
    }
}

inspectLastT();
