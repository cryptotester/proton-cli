#!/usr/bin/env node
const { ACCOUNT, COLLECTION } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get NFTs owned by an account')
    .example('$0 -a fred', 'Get NFTs owned by fred')
    .example('$0 -a fred -c monsters', 'Get "monsters" collection NFTs owned by fred')
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

const { getNftsAdvanced } = require('./nft/get-nfts-advanced');
const { sortDictionary } = require('./utils');

const main = async (account, collection_name, template_id) => {
    console.log(`NFTs owned by ${account}, collection ${collection_name}, template_id ${template_id}`)

    const nftsAdvanced = await getNftsAdvanced({
        owner: account,
        collection_name: collection_name,
        template_id: template_id,
        sort: 'minted',
        order: 'asc',
        page: 1,
        limit: 1000
    })
    if (argv.debug) console.log(nftsAdvanced)

    let groupedNfts = {}
    nftsAdvanced.forEach(nft => {
        if (argv.debug) console.log(`${nft.template_mint}: ${nft.asset_id}`)
        // if (argv.debug) console.log(nft)
        if (collection_name !== '' && nft.collection.collection_name !== collection_name) {
            return
        }
        const tpl_name = nft.template.immutable_data.name
        const collection_friendly_name = nft.collection.name ? ` (${nft.collection.name})` : ''
        const nft_group = `${nft.template.template_id} "${tpl_name}", ${nft.collection.collection_name}${collection_friendly_name}, `
        + `issued: ${nft.template.issued_supply}/${nft.template.max_supply}`
        const nft_info = `${nft.template_mint}: ${nft.asset_id}`
        if (nft_group in groupedNfts) {
            groupedNfts[nft_group].push(nft_info)
        } else {
            groupedNfts[nft_group] = [nft_info]
        }
    });
   
    const sortedNfts = sortDictionary(groupedNfts)
    console.log(sortedNfts)
    Object.keys(sortedNfts).forEach(key => {
        console.log(`${key}, owned: ${sortedNfts[key].length}`)
    })
}

main(argv.account, argv.collection_name, argv.template_id)
