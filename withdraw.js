#!/usr/bin/env node
const { ACCOUNT, TOKEN_CONTRACTS } = require('./constants')
const { transferToken } = require('./token/transfer-token')
const { getQuantity } = require('./utils')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv)
    .command('Tranfer cryptocurrency from your account to another account')
    .example('$0 -p 10000 -s foobar -r cryptotester -m "Hello!"', 'Send 10k FOOBAR to cryptotester with "Hello!" as memo.')
    .describe('amount', 'Amount')
    .alias('p', 'amount')
    .describe('symbol', 'Symbol')
    .alias('s', 'symbol')
    .describe('receiver', 'Receiver')
    .alias(['t', 'r'], 'receiver')
    .describe('memo', 'Memo')
    .alias('m', 'memo')
    .default('memo', '')
    .boolean(['debug'])
    .demandOption(['amount', 'symbol', 'receiver'])
    .argv

const withdraw = async (amount, symbol, receiver, memo) => {

    symbol = symbol.toUpperCase()
    const memoText = (memo !== '') ? ` (memo: ${memo})` : ''
    console.log(`Transfer ${amount} ${symbol} from ${ACCOUNT} to ${receiver}${memoText}.`)
    const quantity = getQuantity(amount, symbol)
    const token_contract = TOKEN_CONTRACTS[symbol]
    if (argv.debug) console.log(`${amount} ${symbol} converted to '${quantity}' (token_contract: ${token_contract})`)

    pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
      ctrlC: 'reject'
    })
    .then(async () => {
      try {
        await transferToken({
            tokenContract: token_contract,
            to: receiver,
            quantity: quantity,
            memo: ''
        })
      } catch (e) {
        console.log(e)
      }
    })
    .catch(() => {
      console.log('You pressed Ctrl + C')
    })
}

withdraw(argv.amount, argv.symbol, argv.receiver, argv.memo)
