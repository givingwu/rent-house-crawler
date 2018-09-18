const { existsSync, mkdirSync } = require('fs')
const { sep, dirname } = require('path')
const cache = {}

function geneTextData(results) {
  return results.reduce((s, t) => {
    return cache[t.title] || (cache[t.title] = s += Object.keys(t).reduce((r, k) => {
      let val = t[k];

      if (typeof val === 'string') {
        return r += ' ' + val
      } else if (Array.isArray(val)) {
        return r += ' ' + val.join(' ')
      }
    }, '\n'));
  }, '\n');
}

function createFolder(to) {
  if (!to) throw new ReferenceError(`Path must be a string. Received ${typeof to}`)
  let folders = dirname(to).split(sep);
  let p = '';

  while (folders.length) {
    p += folders.shift() + sep;

    if (!existsSync(p)) {
      mkdirSync(p);
    }
  }
};

function makeFileExist(path) {
  if (!path) throw new ReferenceError(`Path must be a string. Received ${typeof path}`)
  if (!existsSync(path)) {
    createFolder(path)
  }
}

function fileLog(path) {
  console.log(`Generates ${path} file success.`)
}

function replacer(key, value) {
  // Filtering out properties
  if (typeof value === 'string') {
    return value;
  }

  return value;
}

function stringify(obj) {
  return JSON.stringify(obj, replacer, '  ')
}

module.exports = {
  geneTextData,
  makeFileExist,
  createFolder,
  fileLog,
  stringify,
}