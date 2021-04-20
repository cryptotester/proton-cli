#!/usr/bin/env node
const { sellManyNfts } = require('./nft/marketplace-sell-many')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv)
    .command('Ladder sell NFTs specifying a range of assets (from lower asset_id to higher), max & min price. The command calculates the prices.')
    .example('$0 -c flytothemoon --template_id 21 --from 4398046516712 --to 4398046516714')
    .describe('from_asset_id', 'From this asset_id (lower number)')
    .alias(['i', 'from', 'id', 'asset_id'], 'from_asset_id')
    .describe('to_asset_id', 'To this asset_id (higher number)')
    .alias('to', 'to_asset_id')
    .default('to_asset_id', undefined)
    .describe('max_price', 'Maximum price')
    .alias('max', 'max_price')
    .describe('min_price', 'Minimum price')
    .alias('min', 'min_price')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .default('symbol', undefined)
    .boolean(['debug'])
    .demandOption(['from_asset_id', 'to_asset_id', 'max_price', 'min_price', 'symbol'])
    .argv

const ladderSell = async (from_asset_id, to_asset_id, max_price, min_price, symbol) => {

    if (to_asset_id < from_asset_id) {
        console.log(`You are inverting from and to (from must be lower than to)`)
        return
    }

    if (to_asset_id === undefined) to_asset_id = from_asset_id
    symbol = symbol.toUpperCase()

    let mintCount = 0
    if (argv.debug) console.log(`From min_price ${min_price} to max_price ${max_price} ${symbol}`)
    // TODO: improve calculation to consider also "holes" (not owned, or minted in different times) in asset_ids
    let price_distance = (max_price - min_price) / (to_asset_id - from_asset_id)

    nftsToSell = []
    for (let i = from_asset_id; i <= to_asset_id; i++) {
        let price = Math.round(max_price - mintCount * price_distance)
        console.log(`${i} will be listed for ${price} ${symbol}`)
        nftsToSell.push({
            asset_id: i,
            price: price,
            symbol: symbol
        })
        mintCount++
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

ladderSell(argv.from_asset_id, argv.to_asset_id, argv.max_price, argv.min_price, argv.symbol)
