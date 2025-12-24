const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectTagsDeeply() {
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

    // Look for any : followed by an uppercase letter and hex digits
    const tagRegex = /:([A-Z])([0-9a-f]+),/g;
    let tMatch;
    let tags = {};
    while ((tMatch = tagRegex.exec(combined)) !== null) {
        const tag = tMatch[1];
        tags[tag] = (tags[tag] || 0) + 1;
    }
    console.log('Detected tags mid-string:', tags);

    // Look for where :T shifts to something else
    const firstT = combined.indexOf(':T');
    console.log(`First :T at ${firstT}`);
    console.log(`Context before first :T: ${combined.substring(firstT - 100, firstT)}`);
}

inspectTagsDeeply();
