const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (targetPath, isCustomPath) => {
  const srcPath = path.resolve(process.cwd(), 'src');
  const entry = {};
  const patterns = [];
  const files = fs.readdirSync(srcPath, { recursive: true }).filter(p => p.includes('info.json'));
  for (const file of files) {
    const fileInfo = path.resolve(srcPath, file);
    const guid = require(fileInfo).guid;
    const name = isCustomPath ? 'widget' : require(fileInfo).name.replace(/\s/g, '').toLowerCase();
    entry[guid] = {
      'import': `./src/${path.dirname(file)}/model.tsx`,
      'filename': isCustomPath ? `${guid}/${name}.js` : `${name}.js`
    };

    patterns.push({
      from: fileInfo,
      to: path.resolve(targetPath, isCustomPath ? guid : '', `${name}.json`),
      toType: 'template'
    });
  }
  return { entry, patterns };
};
