const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findBiggestPush() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const pushRegex = /self\.__next_f\.push\(\[\d+,"([\s\S]*?)"\]\)/g;
    let match;
    let biggest = { len: 0, part: '' };
    let count = 0;

    while ((match = pushRegex.exec(content)) !== null) {
        if (match[1].length > biggest.len) {
            biggest = { len: match[1].length, part: match[1], index: count };
        }
        count++;
    }

    console.log(`Found ${count} pushes.`);
    console.log(`Biggest push part at index ${biggest.index} is ${biggest.len} chars.`);

    // Unescape it
    const unescaped = biggest.part
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n');

    console.log(`Unescaped length: ${unescaped.length}`);
    console.log('Start of unescaped biggest push:', unescaped.substring(0, 1000));
}

findBiggestPush();
