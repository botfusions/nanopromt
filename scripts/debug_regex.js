const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function unescapeHtml(text) {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}

const content = fs.readFileSync(sourcePath, 'utf8');
const unescaped = unescapeHtml(content);

// Try a very loose regex
const regex = /"id"\s*:\s*"([^"]+)"/g;
let count = 0;
let match;
while ((match = regex.exec(unescaped)) !== null && count < 10) {
    console.log(`Match ${count}: ${match[1]}`);
    count++;
}

console.log('Total matches found with loose regex:', count);
if (count === 0) {
    console.log('Sample of unescaped text (first 500 chars):');
    console.log(unescaped.substring(0, 500));
}
