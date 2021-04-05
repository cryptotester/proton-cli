#!/usr/bin/env node
const { ACCOUNT } = require('./constants')
const { getListingsByTemplate } = require('./nft/get-listings-by-template')
const { cancelNftSale } = require('./nft/marketplace-unlist')

var argv = require('yargs/yargs')(process.argv)
    .command('Delist NFTs by providing at least "from" asset_id, and "to" for a range. By adding "collection_name' +
            'and "template_id" you make sure to delist only those ones belonging to that collection and template.')
    .example('$0 -c flytothemoon --template_id 21 --from 4398046516712 --to 4398046516714')
    .describe('from_asset_id', 'From this asset_id (lower number)')
    .alias(['i', 'from', 'id', 'asset_id'], 'from_asset_id')
    .describe('to_asset_id', 'To this asset_id (higher number)')
    .alias('to', 'to_asset_id')
    .default('to_asset_id', undefined)
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', '')
    .describe('template_id', 'template_id')
    .default('template_id', '')
    .boolean(['debug'])
    .argv

console.log(argv.template_id)

const main = async (collection_name, template_id, from_asset_id, to_asset_id) => {

    console.log(`Delisting NFTs of collection ${collection_name}, template_id ${template_id}, from ${from_asset_id} to ${to_asset_id}`)
    const listings = await getListingsByTemplate({
        template_id: template_id,
        collection_name: collection_name,
        sort: 'collection_mint',
        order: 'asc'
    })

    let assets = {}
    listings.forEach(l => {
        const price = l.price.amount / Math.pow(10, l.price.token_precision)
        const sale_info = `${price} ${l.price.token_symbol}, asset_id: ${l.assets[0].asset_id}, template_mint: #${l.assets[0].template_mint} sale_id: ${l.sale_id}`
        if (argv.debug) console.log(sale_info)
        assets[l.assets[0].asset_id] = l.sale_id
    })

    if (to_asset_id === undefined) to_asset_id = from_asset_id
    for (i = from_asset_id; i <= to_asset_id; i++) {
        // Check if the asset_id is in the assets for sale, if yet delist it ny sale_id
        if (i in assets) {
            console.log(`Delisting ${i}: ${assets[i]}`)
            await cancelNftSale({
                sale_id: assets[i]
            })
        }
    }
}

main(argv.collection_name, argv.template_id, argv.from_asset_id, argv.to_asset_id)
