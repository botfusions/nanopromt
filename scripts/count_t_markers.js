const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function countTMarkers() {
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
    let count = 0;
    while ((tMatch = tRegex.exec(combined)) !== null) {
        count++;
        if (count < 10) {
            console.log(`Match ${count} at ${tMatch.index}: ${tMatch[0]}`);
            console.log(`Context: ${combined.substring(tMatch.index, tMatch.index + 200)}`);
        }
    }
    console.log(`Total :T matches: ${count}`);
}

countTMarkers();
