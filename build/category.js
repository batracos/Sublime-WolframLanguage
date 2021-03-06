const fs = require('fs');
const dict = require('./usage-dict.json');

// f7c1 = \!
// f7c9 = \(
// f7c8 = \*
// f7c0 = \)

const funcDict = [];
const optDict = [];
const constDict = [];

for (const name in dict) {
  if (dict[name].match(/^\uf7c1\uf7c9\uf7c8RowBox/)) {
    funcDict.push(name.replace('$', '\\$'));
  } else if (dict[name].match(/is an? (\w+ )?option/)) {
    optDict.push(name.replace('$', '\\$'));
  } else {
    constDict.push(name.replace('$', '\\$'));
  }
}

fs.writeFileSync(__dirname + '/name-function.txt', funcDict.join('|'), {encoding: 'utf8'});
fs.writeFileSync(__dirname + '/name-option.txt', optDict.join('|'), {encoding: 'utf8'});
fs.writeFileSync(__dirname + '/name-constant.txt', constDict.join('|'), {encoding: 'utf8'});

const names = Object.keys(dict);
for (let i = names.length - 1; i >= 0; i--) {
  if (names[i][0] === '$') {
    const newName = names[i].slice(1)
    if (!names.includes(newName)) {
      names[i] = newName
    } else {
      names.splice(i, 1)
    }
  }
}

fs.writeFileSync(__dirname + '/../Completions.sublime-completions', JSON.stringify({
  "scope": "source.wolfram",
  "completions": names.sort()
}, null, 2), {encoding: 'utf8'});

