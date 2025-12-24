const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugRscLine() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    const parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    const full = parts.join('');
    const unescaped = full.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
    const rscLines = unescaped.split(/\n?\d+:/);

    // Line 6 was interesting
    console.log(rscLines[6]);
}

debugRscLine();
