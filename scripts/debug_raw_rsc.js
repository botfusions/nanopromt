const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugRawRSC() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];

    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }

    let combined = parts.join('');
    console.log('Combined length:', combined.length);

    // Search for "title" in the raw combined (it might be escaped as \"title\")
    const searchStr = 'title';
    let idx = combined.indexOf(searchStr);
    let count = 0;
    while (idx !== -1 && count < 5) {
        console.log(`Found "${searchStr}" at ${idx}`);
        console.log(`Raw Context: ${combined.substring(idx - 50, idx + 150)}`);
        idx = combined.indexOf(searchStr, idx + 1);
        count++;
    }
}

debugRawRSC();
