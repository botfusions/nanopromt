const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function findPushesLoosely() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    // Flexible regex for self.__next_f.push
    // It might be push([id, "content"]) or push(id, "content")
    const pushRegex = /self\.__next_f\.push\(\s*\[?\s*\d+\s*,\s*"([\s\S]*?)"\s*\]?\s*\)/g;
    let match;
    let count = 0;
    let totalLen = 0;
    let biggest = 0;

    while ((match = pushRegex.exec(content)) !== null) {
        const val = match[1];
        if (val.length > biggest) biggest = val.length;
        totalLen += val.length;
        count++;
    }

    console.log(`Found ${count} pushes.`);
    console.log(`Total content length: ${totalLen}`);
    console.log(`Biggest part: ${biggest}`);
}

findPushesLoosely();
