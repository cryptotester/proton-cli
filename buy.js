#!/usr/bin/env node
const { ACCOUNT } = require('./constants')
const { getQuantityFromPriceListing } = require('./utils')
const { getListings } = require('./nft/get-listings');
const { buyNft } = require('./nft/marketplace-buy')
const pressAnyKey = require('./node_modules/press-any-key')

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
    const quantity = getQuantityFromPriceListing(listing.price)
    console.log(`Found sale_id ${sale_id} by ${seller} for ${quantity}`)

    pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
        ctrlC: 'reject'
    })
    .then(async () => {
        try {
            await buyNft({
                token_contract: token_contract,
                quantity: quantity,
                sale_id: sale_id
            })
        } catch (e) {
            if (e.message.includes("overdrawn balance")) {
                console.log("Error: you don't have enough balance to buy this NFT.")
            } else {
                console.log(e)
            }
        }
    })
    .catch(() => {
        console.log('You pressed Ctrl + C')
    })
}

buy(argv.sale_id)
