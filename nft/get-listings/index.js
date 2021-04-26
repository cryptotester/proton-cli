const { fetch } = require('../../api')
const { NFT_API } = require('../../constants')

const getListings = async ({
    seller = '',
    collection_name = '',
    template_id = '',
    sale_ids = '',
    symbol = '',
    state = 1,
    before = '',
    after = '',
    sort = 'created',
    order = 'desc',
    page = 1,
    limit = 100
}) => {
    const res = await fetch(`${NFT_API}/atomicmarket/v1/sales?seller=${seller}&collection_name=${collection_name}&template_id=${template_id}`
    + `&symbol=${symbol}&ids=${sale_ids}&state=${state}&before=${before}&after=${after}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`)
    const { data } = await res.json()
    return data
}

module.exports = {
    getListings
}