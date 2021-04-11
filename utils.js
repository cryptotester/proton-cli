const { readdirSync } = require('fs')
const { join } = require('path')
const { TOKEN_PRECISIONS } = require('./constants')

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

/**
 * Get quantity for an API buy or sell request, e.g. 100.1 FOOBAR returns `100.100000 FOOBAR`
 * @param amount The amount, e.g. 100.1
 * @param symbol The symbol, e.g. FOOBAR
 * @returns {String} Amount for API request, e.g. 100.100000 FOOBAR
 */
const getQuantity = (amount, symbol) => {
  symbol = symbol.toUpperCase()
  const precision = TOKEN_PRECISIONS[symbol]
  return `${parseFloat(amount).toFixed(precision)} ${symbol}`
}

/**
 * Get amount removing all the extra zeroes of precision, e.g. 10000 XPR returns 1 (because XPR has a precision of 4 digits)
 * @param amount The amount, e.g. 10001
 * @param symbol The symbol, e.g. XPR
 * @returns {Float} Real Amount human readable, e.g. 1.0001
 */
const getHumanFriendlyAmount = (blockchain_amount, symbol) => {
  symbol = symbol.toUpperCase()
  const precision = TOKEN_PRECISIONS[symbol]
  return blockchain_amount / Math.pow(10, precision)
}

module.exports = {
  wait,
  getDeployableFilesFromDir,
  sortDictionary,
  getQuantity,
  getHumanFriendlyAmount
}