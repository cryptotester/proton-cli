#!/usr/bin/env node

const { createCollection } = require('./nft/create-collection')
const { ACCOUNT, CHAIN } = require('./constants')
const pressAnyKey = require('./node_modules/press-any-key')

const AUTHOR = ACCOUNT
const PROTONSEA = 'protonsea' // do not touch this
const COLLECTION_AUTHORIZED_ACCOUNTS = [AUTHOR, PROTONSEA] // if you want to be the only one being able to mint, just use [AUTHOR]
const COLLECTION_NAME = 'test1test1' // strict naming convention, max 13 chars
const COLLECTION_TITLE = 'A nicer and more readable name'
const COLLECTION_IMG = 'QmejwojCLwjbNxqVNwBhyvKj5jUM4kGsm4tGM2U8CbniXy' // hash from IPFS. use https://pinata.cloud/ to upload
const COLLECTION_IMG_URL = `https://cloudflare-ipfs.com/ipfs/${COLLECTION_IMG}`
const COLLECTION_DESCRIPTION = 'You can tell a story of the collection to make it more interesting'
const COLLECTION_URL = 'https://protonsea.com' // put your website, facebook page, collection page or whatever makes sense

//0.01 = 1% ... 0.1 = 10%! AUTHOR will receive this % as "creator fees" on every sale
const CREATOR_FEE = 0.1

console.log(`You are about to create a collection on the "${CHAIN.toUpperCase()}" CHAIN with the following data, plase double check!`)
console.log(`Account/Author (will receive creator fees on every sale): ${AUTHOR}`)
console.log(`Creator fees: ${CREATOR_FEE} (${CREATOR_FEE * 100}%)`)
console.log(`Name (max 13 chars): ${COLLECTION_NAME}`)
console.log(`Title (longer & nicer name): ${COLLECTION_TITLE}`)
console.log(`Thumbnail image: ${COLLECTION_IMG_URL}`)
console.log(`Description: ${COLLECTION_DESCRIPTION}`)
console.log(`URL (author or collection website): ${COLLECTION_URL}`)
console.log(`Accounts authorized to create templates & mint NFTs: ${COLLECTION_AUTHORIZED_ACCOUNTS}`)
console.log('Note: COLLECTION_ IMG, DESCRIPTION & URL can be edited (they are "mutable" data). Only AUTHOR can change them.')

const doCollection = async () => {
    pressAnyKey('Press ENTER if everything looks correct and you wish continue, else press `Ctrl + C` to stop.', {
        ctrlC: 'reject'
    })
    .then(async () => {
        await createCollection({
            collection_name: COLLECTION_NAME,
            creator_fee: CREATOR_FEE,
            data: [
                {"key": "name", "value": ["string", COLLECTION_TITLE]},
                {"key": "img", "value": ["string", COLLECTION_IMG]},
                {"key": "description", "value": ["string", COLLECTION_DESCRIPTION]},
                {"key": "url", "value": ["string", COLLECTION_URL]},
            ],
            authorized_accounts: COLLECTION_AUTHORIZED_ACCOUNTS
        })
    })
    .catch(() => {
        console.log('You pressed Ctrl + C')
    })
}

const main = async () => {
    await doCollection()
}

main()