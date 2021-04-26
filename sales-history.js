#!/usr/bin/env node
const { ACCOUNT, COLLECTION } = require('./constants')
const { isNullOrEmpty } = require('./utils')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get sales history filtered by account, collection, template')
    .example('$0 -a fred', 'Get sales history of NFTs sold by fred')
    .example('$0 -a fred -c monsters', 'Get "monsters" collection sales history sold by fred')
    .describe('account', 'Account (account)')
    .alias('a', 'account')
    .default('account', ACCOUNT)
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', COLLECTION)
    .describe('template_id', 'template_id')
    .alias('t', 'template_id')
    .default('template_id', '')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .default('symbol', 'XUSDC')
    .describe('sinceDate', 'Since (after) date')
    .alias('d', 'sinceDate')
    .describe('untilDate', 'Until (before) date')
    .alias('b', 'untilDate')
    .boolean(['debug'])
    .argv
;

const { getListings } = require('./nft/get-listings');
const { sortDictionary } = require('./utils');

const main = async (account, collection_name, template_id, symbol, sinceDate, untilDate) => {
    let sinceDateMs, untilDateMs = undefined
    let dateText = ''
    if (!isNullOrEmpty(sinceDate)) {
        sinceDateMs = new Date(sinceDate).getTime()
        dateText = ` since ${sinceDate}`
    }
    if (!isNullOrEmpty(untilDate)) {
        untilDateMs = new Date(untilDate).getTime()
        dateText = ` until ${untilDate}`
    }
    console.log(`NFTs sold by ${account}, collection ${collection_name}${dateText}:`)
    const listings = await getListings({
        seller: account,
        collection_name: collection_name,
        template_id: template_id,
        symbol: symbol,
        state: 3,
        before: untilDateMs,
        after: sinceDateMs,
        sort: 'updated',
        order: 'desc',
        limit: 100
    })
    if (argv.debug) console.log(listings) // debug

    let groupedSales = {}
    listings.forEach(l => {
        const key = `${l.assets[0].template.template_id} "${l.assets[0].template.immutable_data.name}"`
        const price = l.price.amount / Math.pow(10, l.price.token_precision)
        const updateTime = new Date(parseInt(l.updated_at_time))
        const updateTimeText = updateTime.toISOString().slice(0, 19).replace('T', ' ')
        const sale_info = `asset_id: ${l.assets[0].asset_id}, template_mint: ${l.assets[0].template_mint}, sale_id: ${l.sale_id},`
        + ` ${parseFloat(price).toLocaleString()} ${l.price.token_symbol}, sold on ${updateTimeText} to ${l.assets[0].owner} (block ${l.updated_at_block})`

        // if (updateTime < sinceDate) {
        //     return
        // }

        if (key in groupedSales) {
            groupedSales[key].push(sale_info)
        } else {
            groupedSales[key] = [sale_info]
        }

        if (argv.debug) console.log(l.assets[0]) // debug
    })

    let sortedSales = sortDictionary(groupedSales)
    for (const [key, assets] of Object.entries(sortedSales)) {
        console.log(`${key} (total: ${sortedSales[key].length})`)
        assets.forEach(a => console.log(a))
    }
}

main(argv.account, argv.collection_name, argv.template_id, argv.symbol, argv.sinceDate, argv.untilDate)
