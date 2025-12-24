const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function countPushes() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const regex = /self\.__next_f\.push/g;
    const matches = content.match(regex);
    console.log(`Total self.__next_f.push calls: ${matches ? matches.length : 0}`);

    // Find the first 3
    let index = 0;
    for (let i = 0; i < 3; i++) {
        index = content.indexOf('self.__next_f.push', index);
        if (index === -1) break;
        console.log(`Push ${i} at index ${index}: ${content.substring(index, index + 200)}`);
        index += 18;
    }

    // Find the last 3
    let lastIndex = content.length;
    for (let i = 0; i < 3; i++) {
        lastIndex = content.lastIndexOf('self.__next_f.push', lastIndex - 1);
        if (lastIndex === -1) break;
        console.log(`Push (last-${i}) at index ${lastIndex}: ${content.substring(lastIndex, lastIndex + 200)}`);
    }
}

countPushes();
