#!/usr/bin/env node
const { ACCOUNT, TOKEN_CONTRACTS} = require('./constants')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Get balances by account/owner')
    .example('$0 -a fred', 'Get fred\'s balances')
    .example('$0 -a syedjafri -s FOOBAR', 'Get syedjafri\'s FOOBAR balances')
    .example('$0 -a syedjafri -s foobar,xusdc', 'Get syedjafri\'s FOOBAR and XUSDC balances')
    .describe('a', 'Account')
    .alias('a', 'account')
    .default('account', ACCOUNT)
    .describe('s', 'Symbol e.g. XPR or comma separated list of symbol, e.g. XPR,FOOBAR')
    .alias('s', 'symbols')
    .default('s', '')
    .boolean(['debug'])
    .argv
;

const { getBalance } = require('./token/get-balance')

const main = async (account, symbols) => {

    symbols = symbols.toUpperCase().split(',')

    if (symbols[0] === '') symbols = undefined

    console.log(`${account}'s balances:`)

    for([symbol, contract] of Object.entries(TOKEN_CONTRACTS)) {
        if (symbols !== undefined) {
            if (!(symbols.includes(symbol))) {
                continue
            }
        }
        const balance = await getBalance({
            account: account,
            tokenContract: TOKEN_CONTRACTS[symbol],
            tokenSymbol: symbol
        })
        console.log(`${balance.toLocaleString()} ${symbol}`)
    }
}

main(argv.account, argv.symbols)
