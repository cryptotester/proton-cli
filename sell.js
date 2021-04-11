#!/usr/bin/env node
const { ACCOUNT, TOKEN_PRECISIONS } = require('./constants')
const { sellNft } = require('./nft/marketplace-sell')

var argv = require('yargs/yargs')(process.argv)
    .command('Sell NFTs by providing at least "from" asset_id, and "to" for a range')
    .example('$0 -c flytothemoon --template_id 21 --from 4398046516712 --to 4398046516714')
    .describe('from_asset_id', 'From this asset_id (lower number)')
    .alias(['i', 'from', 'id', 'asset_id'], 'from_asset_id')
    .describe('to_asset_id', 'To this asset_id (higher number)')
    .alias('to', 'to_asset_id')
    .default('to_asset_id', undefined)
    .describe('price', 'Price')
    .alias('p', 'price')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .default('symbol', '')
    .boolean(['debug'])
    .argv

const sell = async (from_asset_id, to_asset_id, price, symbol) => {

    if (to_asset_id === undefined) to_asset_id = from_asset_id
    symbol = symbol.toUpperCase()

    if (!(symbol in TOKEN_PRECISIONS)) {
        console.log(`${symbol} is not supported: try to update the precisions dictionary in constants.js`)
        return
    }

    const settlement_symbol = `${TOKEN_PRECISIONS[symbol]},${symbol}`

    for (let i = from_asset_id; i <= to_asset_id; i++) {
        console.log(`${i} will be listed for ${price} ${symbol}`)
        await sellNft({
            asset_ids: [i],
            listing_price: price,
            settlement_symbol: settlement_symbol
        })
    }
}

sell(argv.from_asset_id, argv.to_asset_id, argv.price, argv.symbol)

module.exports = {
    sell
}
