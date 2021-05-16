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

/**
 * Get quantity for an API buy or sell request, e.g. 10000 XPR returns `1 XPR`
 * @param price The price object from the listings response, containing symbol, token_precision, amount (long number without commas and additional zeroes as the precision)
 * @returns {String} Amount for API request, e.g. 1.0000 XPR
 */
 const getQuantityFromPriceListing = (price) => {
  symbol = price.token_symbol
  const precision = price.token_precision // this takes the precision as is, from the response
  const blockchain_amount = price.amount
  const amount = blockchain_amount / Math.pow(10, precision) // this doesn't need the coin to be present in the TOKEN_PRECISIONS constant
  return `${parseFloat(amount).toFixed(precision)} ${symbol}`
}

const isNullOrEmpty = (text) => {
  if (text === undefined) return true;
  if (text === null) return true;
  if (text === '') return true;
  if (text.trim() !== '') return false;
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
const chunkArray = (myArray, chunk_size) => {
  var results = [];

  while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

module.exports = {
  wait,
  getDeployableFilesFromDir,
  sortDictionary,
  getQuantity,
  getHumanFriendlyAmount,
  getQuantityFromPriceListing,
  isNullOrEmpty,
  chunkArray
}