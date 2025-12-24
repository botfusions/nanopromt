const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findBigArrays() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const regex = /\[[\s\S]*?\]/g;
    let match;
    const arrays = [];

    while ((match = regex.exec(content)) !== null) {
        if (match[0].length > 10000) {
            arrays.push({
                index: match.index,
                length: match[0].length,
                preview: match[0].substring(0, 500)
            });
        }
    }

    arrays.sort((a, b) => b.length - a.length);
    console.log(`Found ${arrays.length} large arrays.`);
    arrays.slice(0, 5).forEach((item, i) => {
        console.log(`Array ${i}: length ${item.length}, index ${item.index}`);
        console.log(`Preview: ${item.preview}`);
    });
}

findBigArrays();
