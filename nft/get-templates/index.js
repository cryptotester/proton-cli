const { fetch } = require('../../api')
const { NFT_API } = require('../../constants')

const getTemplates = async ({
    authorized_account = '',
    collection_name = '',
    sort = 'created',
    order = 'asc',
    page = 1,
    limit = 100
}) => {
    const url = `${NFT_API}/atomicassets/v1/templates?authorized_account=${authorized_account}&collection_name=${collection_name}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`
    const res = await fetch(url)
    const { data } = await res.json()
    return data
}

module.exports = {
    getTemplates
}