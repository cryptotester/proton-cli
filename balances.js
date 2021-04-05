#!/usr/bin/env node
const { QUERY_ACCOUNT } = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get balances by account/owner')
    .example('$0 -a syedjafri', 'Get syedjafri\'s balances')
    .describe('a', 'Account')
    .alias('a', 'account')
    .default('account', QUERY_ACCOUNT)
    .boolean(['debug'])
    .argv
;

const { getBalance } = require('./token/get-balance')

const main = async (account) => {

    console.log(`${account} balances:`)
    const currencies = {
        'XPR': 'eosio.token',
        'XUSDC': 'xtokens',
        'XUSDT': 'xtokens',
        'FOOBAR': 'xtokens',
    }

    for([symbol, contract] of Object.entries(currencies)) {
        const balance = await getBalance({
            account: account,
            tokenContract: currencies[symbol],
            tokenSymbol: symbol
        })
        console.log(`${balance} ${symbol}`)
    }
}

main(argv.account)
