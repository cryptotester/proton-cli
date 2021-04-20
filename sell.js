#!/usr/bin/env node
const { TOKEN_PRECISIONS } = require('./constants')
const { sellManyNfts } = require('./nft/marketplace-sell-many')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv)
    .command('Sell NFTs by providing at least "from" asset_id, and "to" for a range')
    .example('$0 -c flytothemoon --template_id 21 --from 4398046516712 --to 4398046516714')
    .describe('from_asset_id', 'From this asset_id (lower number)')
    .alias(['i', 'from', 'id', 'asset_id'], 'from_asset_id')
    .describe('to_asset_id', 'To this asset_id (higher number)')
    .alias('to', 'to_asset_id')
    .describe('price', 'Price')
    .alias('p', 'price')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .default('symbol', '')
    .boolean(['debug'])
    .demandOption(['from_asset_id', 'price', 'symbol'])
    .argv

const sell = async (from_asset_id, to_asset_id, price, symbol) => {

    if (to_asset_id === undefined) to_asset_id = from_asset_id
    symbol = symbol.toUpperCase()

    if (!(symbol in TOKEN_PRECISIONS)) {
        console.log(`${symbol} is not supported: try to update the precisions dictionary in constants.js`)
        return
    }

    nftsToSell = []
    for (let i = from_asset_id; i <= to_asset_id; i++) {
        console.log(`${i} will be listed for ${price} ${symbol}`)
        nftsToSell.push({
            asset_id: i,
            price: price,
            symbol: symbol
        })
    }
    pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
        ctrlC: 'reject'
    })
    .then(async () => {
        try {
            await sellManyNfts({ nftsToSell })
        } catch (e) {
            console.log(e)
        }
    })
    .catch(() => {
        console.log('You pressed Ctrl + C')
    })
}

sell(argv.from_asset_id, argv.to_asset_id, argv.price, argv.symbol)

module.exports = {
    sell
}
