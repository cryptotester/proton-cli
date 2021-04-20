#!/usr/bin/env node
const { ACCOUNT } = require('./constants')
const { buyStorage } = require('./chain/buy-storage')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('Buy blockchain storage (RAM). Note: 1 KB or RAM costs 22 XPR (20 XPR + 10% fee). 10 kB of RAM should be enough to mint around 70 NFTs (it depends on how much space they require).')
    .example('$0 -b 10000', 'Buy 10000 bytes of RAM')
    .example('$0 -k 10', 'Buy 10 kB of RAM')
    .example('$0 -k 10 -t protonsea', 'Buy 10 kB of RAM and tranfer them to protonsea. If you do this I will be thankful, receiving tips in RAM looks cool ;)')
    .describe('bytes', 'Bytes')
    .alias('b', 'bytes')
    .default('bytes', 0)
    .describe('kilobytes', 'Kilobytes')
    .alias('k', 'kilobytes')
    .default('kilobytes', 0)
    .describe('to', 'Receiver')
    .alias('t', 'to')
    .default('to', ACCOUNT)
    .boolean(['debug'])
    .argv
;

const buyRam = async (bytes, kilobytes, receiver = ACCOUNT) => { 

  if (bytes === 0 && kilobytes > 0) {
    bytes = kilobytes * 1000
  } 
  else if (bytes > 0 && kilobytes === 0) {
    kilobytes = bytes / 1000
  }
  else {
    console.log('You must specify the amount either in bytes (-b) or in kilobytes (-k)')
    return
  }

  const pricePerByte = 22 / 1000
  const cost = bytes * pricePerByte
  const receverText = (receiver !== ACCOUNT) ? ` to be sent to ${receiver}` : ''
  console.log(`With your account ${ACCOUNT} you are buying ${kilobytes} kB if RAM${receverText}. ` +
              `This will cost you ${Math.round(cost)} XPR.`)

  pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
    ctrlC: 'reject'
  })
    .then(async () => {
      await buyStorage({
        bytes: bytes,
        receiver: receiver
      })
    })
    .catch(() => {
      console.log('You pressed Ctrl + C')
    })
}

buyRam(argv.bytes, argv.kilobytes, argv.to)
