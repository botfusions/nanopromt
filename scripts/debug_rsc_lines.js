const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugRsc() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    const parts = [];
    while ((match = pushRegex.exec(content)) !== null) {
        parts.push(match[1]);
    }
    const full = parts.join('');
    // Unescape only common RSC markers
    const unescaped = full.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');

    // Split by RSC line markers (number followed by colon)
    const rscLines = unescaped.split(/\n?\d+:/);
    console.log(`Found ${rscLines.length} RSC logical lines.`);

    rscLines.forEach((line, i) => {
        if (line.length > 2000) {
            console.log(`Line ${i}: length ${line.length}`);
            console.log(`Snippet: ${line.substring(0, 500)}`);
        }
    });
}

debugRsc();
