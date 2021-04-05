const { fetch } = require('../../api')
const { NFT_API } = require('../../constants')

const getListings = async ({
    seller,
    collection_name,
    sort = 'created',
    order = 'desc',
    page = 1,
    limit = 100
}) => {
    const res = await fetch(`${NFT_API}/atomicmarket/v1/sales?seller=${seller}&collection_name=${collection_name}&state=1&sort=${sort}&order=${order}&page=${page}&limit=${limit}`)
    const { data } = await res.json()
    return data
}

module.exports = {
    getListings
}