const { transact } = require('../../api')
const { ACCOUNT, ACCOUNT_PERMISSION, TOKEN_PRECISIONS } = require('../../constants')
const { getQuantity } = require('../../utils')

const sellManyNfts = async ({
    nftsToSell = [],
    makerMarketplace = 'protonsea'
}) => {
    let payload = []
    nftsToSell.forEach(nft => {
        const _symbol = nft.symbol.toUpperCase()
        const _price = nft.price
        if (!(_symbol in TOKEN_PRECISIONS)) {
            console.log(`${_symbol} is not supported: please update the precisions dictionary in constants.js`)
            return
        }
        const precision = TOKEN_PRECISIONS[_symbol]
        const settlementSymbol = `${precision},${_symbol}`
        const listingPrice = getQuantity(_price, _symbol)
        console.log(`${nft.asset_id} will be listed for ${listingPrice} (${settlementSymbol})`)

        payload.push({
            account: "atomicmarket",
            name: "announcesale",
            data: {
                seller: ACCOUNT,
                asset_ids: [nft.asset_id],
                listing_price: listingPrice,
                settlement_symbol: settlementSymbol,
                maker_marketplace: makerMarketplace
            },
            authorization: [{ actor: ACCOUNT, permission: ACCOUNT_PERMISSION }],
        },
        {
            account: "atomicassets",
            name: "createoffer",
            data: {
                sender: ACCOUNT,
                recipient: 'atomicmarket',
                sender_asset_ids: [nft.asset_id],
                recipient_asset_ids: [],
                memo: 'sale'
            },
            authorization: [{ actor: ACCOUNT, permission: ACCOUNT_PERMISSION }],
        })
    })

    await transact(payload)
    console.log(`Successully listed ${nftsToSell.length} NFTs.`)
}

module.exports = {
    sellManyNfts
}