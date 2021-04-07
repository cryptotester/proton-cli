#!/usr/bin/env node
const { ACCOUNT } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get creator balances by account')
    .example('$0 -a monsters', 'Get monsters\'s creator balances')
    .describe('a', 'Account')
    .alias('a', 'account')
    .default('account', ACCOUNT)
    .boolean(['debug'])
    .argv
;

const { getMarketplaceBalances } = require('./nft/get-marketplace-balances')

const main = async (account) => {
    const creatorBalances = await getMarketplaceBalances({
        collection_creator: account
    })

    console.log(`${account}'s creator balances: ${creatorBalances}`)
}

main(argv.account)
