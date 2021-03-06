const { transact } = require('../../api')
const { SYSTEM, ACCOUNT, ACCOUNT_PERMISSION } = require('../../constants')

const buyStorage = async ({ bytes, receiver = ACCOUNT }) => {
    await transact([{
        account: SYSTEM,
        name: 'buyrambytes',
        data: {
            payer: ACCOUNT,
            receiver: receiver,
            bytes: bytes
        },
        authorization: [{ actor: ACCOUNT, permission: ACCOUNT_PERMISSION }]
    }])
    console.log(`${bytes} bytes of Blockchain Storage successfully purchased!`)
}

module.exports = {
    buyStorage
}