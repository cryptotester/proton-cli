const { transact } = require('../../api')
const { ACCOUNT, ACCOUNT_PERMISSION } = require('../../constants')

const cancelNftSale = async ({
    sale_ids
}) => {

    if (!(Array.isArray(sale_ids))) {
        sale_ids = [sale_ids]
    }

    let payload = []
    sale_ids.forEach(s => payload.push(
        {
            account: "atomicmarket",
            name: "cancelsale",
            data: {
                sale_id: s
            },
            authorization: [{ actor: ACCOUNT, permission: ACCOUNT_PERMISSION }],
        }
    ))
    await transact(payload)
    console.log(`NFTs successfully unlisted!`)
}

module.exports = {
    cancelNftSale
}