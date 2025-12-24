const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectRSC() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    let combined = parts.join('');

    const target = 'NanoBananaPageContent';
    const idx = combined.indexOf(target);
    if (idx !== -1) {
        console.log(`Found ${target} at ${idx}`);
        // Log 10,000 chars after this to see if the array starts
        console.log(combined.substring(idx, idx + 10000));
    }
}

inspectRSC();
