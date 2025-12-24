const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findPortreli() {
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

    const searchStr = 'Portreli';
    let idx = combined.indexOf(searchStr);
    if (idx !== -1) {
        console.log(`Found "${searchStr}" at ${idx}`);
        console.log(`Context: ${combined.substring(idx - 500, idx + 2000)}`);
    } else {
        console.log(`"${searchStr}" not found in unescaped combined stream.`);
    }
}

findPortreli();
