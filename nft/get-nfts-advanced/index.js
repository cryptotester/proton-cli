const { fetch } = require('../../api')
const { NFT_API } = require('../../constants')

const getNftsAdvanced = async ({
    owner,
    collection_name,
    sort = 'created',
    order = 'desc',
    page = 1,
    limit = 100
}) => {
    const url = `${NFT_API}/atomicassets/v1/assets?owner=${owner}&collection_name=${collection_name}&state=1&sort=${sort}&order=${order}&page=${page}&limit=${limit}`
    const res = await fetch(url)
    const { data } = await res.json()
    return data
}

module.exports = {
    getNftsAdvanced
}