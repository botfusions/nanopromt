const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugMatches() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const regex = /data-id="(\d+)"/g;
    let match;
    let count = 0;
    while ((match = regex.exec(content)) !== null) {
        if (count < 5) {
            console.log(`Found ID: ${match[1]} at index ${match.index}`);
        }
        count++;
    }
    console.log(`Total data-id matches: ${count}`);
}

debugMatches();
