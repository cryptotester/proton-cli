#!/usr/bin/env node
const { ACCOUNT, COLLECTION } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get NFTs listed for sale')
    .example('$0 -a fred', 'Get NFTs for sale by fred')
    .example('$0 -a fred -c monsters', 'Get "monsters" collection NFTs for sale by fred')
    .describe('account', 'Account (account)')
    .alias('a', 'account')
    .default('account', ACCOUNT)
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', COLLECTION)
    .describe('template_id', 'template_id')
    .alias('t', 'template_id')
    .default('template_id', '')
    .boolean(['debug'])
    .argv
;

const { getListings } = require('./nft/get-listings');
const { sortDictionary } = require('./utils');

const main = async (account, collection_name, template_id) => {
    console.log(`NFTs for sale by ${account}, collection ${collection_name}:`)
    const listings = await getListings({
        seller: account,
        collection_name: collection_name,
        template_id: template_id,
        sort: 'collection_mint',
        order: 'asc',
        limit: 1000
    })
    if (argv.debug) console.log(listings) // debug

    let groupedSales = {}
    listings.forEach(l => {
        const key = `${l.assets[0].template.template_id} "${l.assets[0].template.immutable_data.name}"`
        const price = l.price.amount / Math.pow(10, l.price.token_precision)
        const sale_info = `asset_id: ${l.assets[0].asset_id}, template_mint: ${l.assets[0].template_mint}, sale_id: ${l.sale_id}, ${price} ${l.price.token_symbol}`

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

main(argv.account, argv.collection_name, argv.template_id)
