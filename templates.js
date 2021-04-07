#!/usr/bin/env node
const { ACCOUNT, COLLECTION } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get templates')
    .example('$0 -a protonsea', 'Get templates available for protonsea')
    .describe('account', 'Account (account)')
    .alias('a', 'account')
    .default('account', ACCOUNT)
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', COLLECTION)
    .boolean(['debug'])
    .argv
;

const { getTemplates } = require('./nft/get-templates')

const main = async (account, collection_name) => {
    const templates = await getTemplates({
        authorized_account: account,
        collection_name: collection_name
    })

    if (argv.debug) console.log(templates)

    templates.forEach(t => {
        console.log(`${t.collection.collection_name} (by ${t.collection.author}), ${t.template_id} "${t.name}", issued: ${t.issued_supply}, max_supply: ${t.max_supply}`)
    })
}

main(argv.account, argv.collection_name)
