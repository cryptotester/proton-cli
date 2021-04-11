require('dotenv').config()

const ACCOUNT = process.env.ACCOUNT
const ACCOUNT_PERMISSION = process.env.ACCOUNT_PERMISSION
const CHAIN = process.env.CHAIN

const ENDPOINT = CHAIN === 'proton'
    ? 'https://proton.eoscafeblock.com'
    : 'https://testnet.protonchain.com'

const NFT_API = CHAIN === 'proton'
    ? 'https://proton.api.atomicassets.io'
    : 'https://test.proton.api.atomicassets.io'

const SYSTEM = 'eosio' // don't change
const XPR_TOKEN_CONTRACT = 'eosio.token' // don't change

const TOKEN_PRECISIONS = {
    'XPR': 4,
    'XUSDC': 6,
    'FOOBAR': 6
}

const TOKEN_CONTRACTS = {
    'XPR': 'eosio.token',
    'XUSDC': 'xtokens',
    'XUSDT': 'xtokens',
    'FOOBAR': 'xtokens',
}

const COLLECTION = process.env.COLLECTION

module.exports = {
    ACCOUNT,
    ACCOUNT_PERMISSION,
    SYSTEM,
    XPR_TOKEN_CONTRACT,
    CHAIN,
    ENDPOINT,
    NFT_API,
    COLLECTION,
    TOKEN_PRECISIONS,
    TOKEN_CONTRACTS
}