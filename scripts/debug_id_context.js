const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugId() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const searchStr = 'id';
    let index = content.indexOf(searchStr);
    let count = 0;

    console.log('Finding context for "id":');
    while (index !== -1 && count < 30) {
        console.log(`--- Match ${count} (index ${index}) ---`);
        console.log(content.substring(index - 50, index + 150));
        index = content.indexOf(searchStr, index + 1);
        count++;
    }
}

debugId();
