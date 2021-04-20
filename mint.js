#!/usr/bin/env node

const { transact } = require('./api')
const { ACCOUNT, COLLECTION, ACCOUNT_PERMISSION } = require('./constants')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv)
    .command('Mint NFTs by specifying collectionName, schemaName, templateId, desired quantity & (optional) the new owner (receiver)')
    .example('$0 -c flytothemoon -t 26 -s 1stedition -q 10', 'Mint 10 NFTs')
    .example('$0 -c flytothemoon -t 26 -s 1stedition -q 10 -r cryptotester', 'Mint 10 NFTs specifying cryptotester as new owner')
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', COLLECTION)
    .describe('schema_name', 'Schema name')
    .alias('s', 'schema_name')
    .describe('template_id', 'template_id')
    .alias('t', 'template_id')
    .describe('quantity', 'quantity')
    .alias('q', 'quantity')
    .describe('receiver', 'Receiver')
    .alias(['r', 'to'], 'receiver')
    .boolean(['debug'])
    .demandOption(['collection_name', 'schema_name', 'template_id', 'quantity'])
    .argv

const mintNfts = async (collectionName, schemaName, templateId, quantity, receiver = undefined) => {

    if (collectionName === '' || collectionName === undefined) {
        console.log('Error, you must define a collection name by using the option -c collectionName')
        return
    }

    if (receiver === undefined) {
        receiver = ACCOUNT
    }

    let batch = []
    for (let i = 1; i <= quantity; i++) {
        const trx = {
            "account": "atomicassets",
            "name": "mintasset",
            "authorization": [{
                "actor": ACCOUNT,
                "permission": ACCOUNT_PERMISSION
            }],
            "data": {
                "authorized_minter": ACCOUNT,
                "collection_name": collectionName,
                "schema_name": schemaName,
                "template_id": templateId,
                "new_asset_owner": receiver,
                "immutable_data": [],
                "mutable_data": [],
                "tokens_to_back": []
            }
        }
        batch.push(trx)
    }

    const receiverText = (receiver !== ACCOUNT) ? ` that will be owned by ${receiver}` : ''
    console.log(`You will mint ${batch.length} NFTs`
    + ` (collection ${collectionName}, template ${templateId}, schema ${schemaName})${receiverText}. Proceed?`)

    pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
        ctrlC: 'reject'
    })
    .then(async () => {
        if (argv.debug) console.log(batch)
        try {
            await transact(batch)
            console.log(`Minted ${batch.length} NFT with template_id ${templateId}`)
        } catch (e) {
            console.log(e)
        }
    })
    .catch(() => {
        console.log('You pressed Ctrl + C')
    })
}

mintNfts(argv.collection_name, argv.schema_name, argv.template_id, argv.quantity, argv.receiver)
