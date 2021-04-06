#!/usr/bin/env node
const { QUERY_ACCOUNT, COLLECTION } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get NFTs for sale filtered by account (account) and/or by collection name')
    .example('$0 -o fred', 'Get NFTs for sale by fred')
    .describe('a', 'Account (account)')
    .alias('a', 'account')
    .default('account', QUERY_ACCOUNT)
    .describe('c', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', COLLECTION)
    .boolean(['debug'])
    .argv
;

const { getListings } = require('./nft/get-listings');
const { sortDictionary } = require('./utils');

const main = async (account, collection_name) => {
    console.log(`NFTs sold by ${account}, collection ${collection_name}:`)
    const listings = await getListings({
        seller: account,
        collection_name: collection_name,
        sort: 'collection_mint',
        order: 'asc'
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
    console.log(sortedSales)
}

main(argv.account, argv.collection_name)
