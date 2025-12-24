const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function debugTitle() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const searchStr = 'Portreli ve Çince/İngilizce kişiselleştirmeli geniş alıntı kartı';
    const index = content.indexOf(searchStr);

    if (index === -1) {
        console.log('Title not found.');
        return;
    }

    console.log(`Title found at index ${index}. Context (2000 chars):`);
    console.log(content.substring(index - 500, index + 1500));
}

debugTitle();
