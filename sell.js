#!/usr/bin/env node
const { TOKEN_PRECISIONS } = require('./constants')
const { sellManyNfts } = require('./nft/marketplace-sell-many')
const pressAnyKey = require('./node_modules/press-any-key')
const { wait, chunkArray } = require('./utils')

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
    .default('symbol', 'XUSDC')
    .boolean(['yes'])
    .alias('y', 'yes')
    .boolean(['batch'])
    .alias('b', 'batch')
    .describe('batch_size', 'Batch Size')
    .alias('bs', 'batch_size')
    .default('batch_size', 15)
    .describe('batch_timeout', 'Batch Timeout (in seconds)')
    .alias('bt', 'batch_timeout')
    .default('batch_timeout', 6)
    .boolean(['debug'])
    .demandOption(['from_asset_id', 'price', 'symbol'])
    .argv

const _sell = async (nftsToSell, batch, batchSize, batchTimeout) => {
    try {
        if (batch) {
            let totalToSell = nftsToSell.length
            let chunked = chunkArray(nftsToSell, batchSize)
            console.log(`Listing ${totalToSell} NFTs in ${chunked.length} batches of ${batchSize}, each ${batchTimeout} seconds.`)
            const estimatedTime = (chunked.length * batchTimeout) + chunked.length * 1
            console.log(`Estimated time: ${estimatedTime} seconds.`)
            for (let i = 0; i < chunked.length; i++) {
                await sellManyNfts({ nftsToSell: chunked[i] })
                if (i < chunked.length - 1) await wait(batchTimeout * 1000)
            }
        } else {
            await sellManyNfts({ nftsToSell })
        }
    } catch (e) {
        console.log(e)
    }
}

const sell = async (from_asset_id, to_asset_id, price, symbol, yes, batch, batch_size, batch_timeout) => {

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
    if (yes) {
        _sell(nftsToSell, batch, batch_size, batch_timeout)
    } else {
        pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
            ctrlC: 'reject'
        })
        .then(async () => {
            _sell(nftsToSell, batch, batch_size, batch_timeout)
        })
        .catch(() => {
            console.log('You pressed Ctrl + C')
        })
    }
}

sell(argv.from_asset_id, argv.to_asset_id, argv.price, argv.symbol, argv.yes, argv.batch, argv.batch_size, argv.batch_timeout)

module.exports = {
    sell
}
