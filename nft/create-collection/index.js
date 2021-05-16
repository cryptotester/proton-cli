const { transact } = require('../../api')
const { ACCOUNT, ACCOUNT_PERMISSION } = require('../../constants')

const createCollection = async ({
    collection_name,
    creator_fee,
    data,
    authorized_accounts = [ACCOUNT]
}) => {
    await transact([{
        account: "atomicassets",
        name: "createcol",
        data: {
            author: ACCOUNT,
            collection_name: collection_name,
            allow_notify: true,
            authorized_accounts: authorized_accounts,
            notify_accounts: [],
            market_fee: creator_fee,
            data: data
        },
        authorization: [{ actor: ACCOUNT, permission: ACCOUNT_PERMISSION }],
    }])
    console.log(`Collection ${collection_name} created! Authorized accounts:`)
    console.log(authorized_accounts)
}

module.exports = {
    createCollection
}