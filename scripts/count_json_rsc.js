const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function countAllJsonPrompts() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    const parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    const full = parts.join('');
    const unescaped = full.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');

    // Find all occurrences of "id":
    const idMatches = unescaped.match(/"id":/g);
    console.log(`Total "id": in RSC: ${idMatches ? idMatches.length : 0}`);

    // Find all occurrences of "title":
    const titleMatches = unescaped.match(/"title":/g);
    console.log(`Total "title": in RSC: ${titleMatches ? titleMatches.length : 0}`);
}

countAllJsonPrompts();
