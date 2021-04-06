const { readdirSync } = require('fs')
const { join } = require('path')

const getDeployableFilesFromDir = (dir) => {
    const dirCont = readdirSync(dir)
    const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi))
    const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi))
    if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`)
    if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`)
    return {
      wasmPath: join(dir, wasmFileName),
      abiPath: join(dir, abiFileName),
    }
}

const wait = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const sortDictionary = (unordered) => Object.keys(unordered).sort().reduce(
  (obj, key) => { 
    obj[key] = unordered[key]; 
    return obj;
  }, 
  {}
);

module.exports = {
  wait,
  getDeployableFilesFromDir,
  sortDictionary
}