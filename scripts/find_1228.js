const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function find1228() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const searchStr = '1228';
    let index = content.indexOf(searchStr);

    while (index !== -1) {
        console.log(`Found 1228 at index ${index}`);
        console.log(`Context: ${content.substring(index - 200, index + 200)}`);
        index = content.indexOf(searchStr, index + 1);
    }
}

find1228();
