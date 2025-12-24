const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugRSC() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let count = 0;

    // We'll collect all parts and then unescape once
    const parts = [];
    while ((match = pushRegex.exec(content)) !== null && count < 100) {
        parts.push(match[1]);
        count++;
    }

    let combined = parts.join('');
    // Basic unescape
    combined = combined
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');

    console.log('Combined length:', combined.length);
    // Find something that looks like a prompt object in the RSC
    const promptIndex = combined.indexOf('"title"');
    if (promptIndex !== -1) {
        console.log('Sample around "title":');
        console.log(combined.substring(promptIndex - 200, promptIndex + 2000));
    } else {
        console.log('"title" not found in combined stream.');
        // Just show first 2000 chars of combined
        console.log('Start of stream:', combined.substring(0, 2000));
    }
}

debugRSC();
