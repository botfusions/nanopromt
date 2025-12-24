const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findTitleEverywhere() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const searchStr = 'Portreli ve Çince/İngilizce kişiselleştirmeli geniş alıntı kartı';
    let index = content.indexOf(searchStr);

    console.log(`Searching for "${searchStr}"...`);
    while (index !== -1) {
        console.log(`Found instance at index ${index}`);
        console.log(`- Snippet: ${content.substring(index - 50, index + 150)}`);
        index = content.indexOf(searchStr, index + 1);
    }
}

findTitleEverywhere();
