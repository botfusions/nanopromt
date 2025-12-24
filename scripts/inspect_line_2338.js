const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../BotNANo.txt');

function inspectLine2338() {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const lines = content.split('\n');
    const line = lines[2337]; // 2338th line
    console.log(`Line 2338 length: ${line.length}`);
    console.log('Start of line:', line.substring(0, 500));
    console.log('End of line:', line.substring(line.length - 500));

    // Check if it contains self.__next_f.push
    const pushIdx = line.indexOf('self.__next_f.push');
    console.log('Index of self.__next_f.push:', pushIdx);
    if (pushIdx !== -1) {
        console.log('Sample around push:', line.substring(pushIdx, pushIdx + 500));
    }
}

inspectLine2338();
