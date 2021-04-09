#!/usr/bin/env node

var argv = require('yargs/yargs')(process.argv)
    .command('Relist NFT by providing the asset_id, new price & symbol')
    .example('$0 -i 123456789 -p 1000 -s foobar')
    .describe('asset_id', 'asset_id')
    .alias(['i', 'id'], 'asset_id')
    .demandOption('asset_id')
    .describe('collection_name', 'Collection name')
    .alias('c', 'collection_name')
    .default('collection_name', '')
    .describe('template_id', 'template_id')
    .alias('t', 'template_id')
    .default('template_id', '')
    .describe('price', 'Price')
    .alias('p', 'price')
    .demandOption('price')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .default('symbol', 'XPR')
    .demandOption('symbol')
    .boolean(['debug'])
    .argv

const timer = ms => new Promise(res => setTimeout(res, ms))

const main = async () => {
    require('./delist')
    await timer(2000)
    require('./sell')
}

main()
