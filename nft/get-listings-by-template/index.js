const { fetch } = require('../../api')
const { NFT_API } = require('../../constants')

const getListingsByTemplate = async ({
    seller = '',
    collection_name = '',
    template_id = '',
    symbol = '',
    sort = 'price',
    order = 'asc',
    page = 1,
    limit = 100
}) => {
    const res = await fetch(`${NFT_API}/atomicmarket/v1/sales?collection_name=${collection_name}&template_id=${template_id}&state=1&symbol=${symbol}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`)
    const { data } = await res.json()
    return data
}

module.exports = {
    getListingsByTemplate
}