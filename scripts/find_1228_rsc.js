const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function find1228InRSC() {
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

    const searchStr = '1228';
    let idx = combined.indexOf(searchStr);
    while (idx !== -1) {
        console.log(`Found "1228" at ${idx}`);
        console.log(`Context: ${combined.substring(idx - 200, idx + 200)}`);
        idx = combined.indexOf(searchStr, idx + 1);
    }
}

find1228InRSC();
