#!/usr/bin/env node
const { ACCOUNT } = require('./constants')
const { transferNft } = require('./nft/transfer-nft')
const pressAnyKey = require('./node_modules/press-any-key')

var argv = require('yargs/yargs')(process.argv)
    .command('Send NFTs by (required) "start" asset_id, and (optionally) and "end" asset_id for a range')
    .example('$0 -s 1000 -e 1010 -r tippedtipped -m 565020661', 'Send NFTs ranging from asset_id 1000 to 1010 to tipbot with specific user memo (in this example cryptotester\'s memo)')
    .example('$0 -s 123456 -r cryptotester -m "Thank you!"', 'Send NFT (asset_id 123456) to cryptotester with "Thank you!" as memo.')
    .describe('start_asset_id', 'Start range from this asset_id (lower number)')
    .alias(['s', 'i', 'start', 'id', 'asset_id'], 'start_asset_id')
    .describe('end_asset_id', 'End range to this asset_id (higher number)')
    .alias(['e', 'end'], 'end_asset_id')
    .default('end_asset_id', undefined)
    .describe('receiver', 'Receiver')
    .alias(['t', 'r'], 'receiver')
    .describe('memo', 'Memo')
    .alias('m', 'memo')
    .default('memo', '')
    .boolean(['debug'])
    .demandOption(['asset_id','receiver'])
    .argv

const sendNft = async (start_asset_id, end_asset_id, receiver, memo) => {

    const nftsText = (end_asset_id === undefined) ? `NFT ${start_asset_id}` : `NFTs from ${start_asset_id} to ${end_asset_id}`
    const memoText = (memo !== '') ? ` (memo: ${memo})` : ''
    console.log(`Sending ${nftsText} from ${ACCOUNT} to ${receiver}${memoText}.`)

    if (end_asset_id === undefined) end_asset_id = start_asset_id
    let assets = []
    for (let i = start_asset_id; i <= end_asset_id; i++) {
        // TODO: check that the account really owns this asset_id, if not skip it
        assets.push(i)
    }

    pressAnyKey('Press ENTER to continue, or Ctrl + C to stop.', {
        ctrlC: 'reject'
      })
        .then(async () => {
            await transferNft({
                to: receiver,
                asset_ids: assets,
                memo: `${memo}`
            })
        })
        .catch(() => {
          console.log('You pressed Ctrl + C')
        })
}

sendNft(argv.start_asset_id, argv.end_asset_id, argv.receiver, argv.memo)
