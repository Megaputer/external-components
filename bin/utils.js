const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (targetPath) => {
  const srcPath = path.resolve(process.cwd(), 'src');
  const entry = {};
  const patterns = [];
  const files = fs.readdirSync(srcPath, { recursive: true }).filter(p => p.includes('info.json'));
  for (const file of files) {
    const pathFile = path.resolve(srcPath, file);
    const guid = require(pathFile).guid;
    entry[guid] = {
      'import': `./src/${path.dirname(file)}/model.tsx`,
      'filename': `${guid}/widget.js`
    };

    patterns.push({ from: pathFile, to: path.resolve(targetPath, guid, 'info.json') });
  }
  return { entry, patterns };
};
