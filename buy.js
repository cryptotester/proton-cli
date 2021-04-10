#!/usr/bin/env node
const { ACCOUNT } = require('./constants')
const { getListings } = require('./nft/get-listings');
const { buyNft } = require('./nft/marketplace-buy')

var argv = require('yargs/yargs')(process.argv)
    .command('Buy NFTs by sale_id')
    .example('$0 --sale_id 1234')
    .describe('sale_id', 'sale_id')
    .demand('sale_id')
    .boolean(['debug'])
    .argv

const buy = async (sale_id) => {
    // Get listing in order to know the price
    const listings = await getListings({
        sale_ids: sale_id,
        limit: 2
    })
    if (listings.length > 1) { 
        console.log(listings)
        console.log(`Error: multiple listings fetched (${listings.length}) with the sale_id ${sale_id}`)
        return
    }
    const listing = listings[0]
    if (argv.debug) console.log(listing) // debug

    const seller = listing.seller
    const token_contract = listing.price.token_contract
    const symbol = listing.price.token_symbol
    const precision = listing.price.token_precision
    const amount_machine_friendly = listing.price.amount
    const amount = amount_machine_friendly / Math.pow(10, precision)
    const quantity = `${parseInt(amount).toFixed(precision)} ${symbol}`
    if (argv.debug) console.log(`Blockchain amount ${amount_machine_friendly} (human friendly: ${amount}) converted to API format ${quantity} (${token_contract})`) // debug quantity
    console.log(`Found sale_id ${sale_id} by ${seller} for ${amount} ${symbol}`)

    await buyNft({
        token_contract: token_contract,
        quantity: quantity,
        sale_id: sale_id
    })
}

buy(argv.sale_id)
