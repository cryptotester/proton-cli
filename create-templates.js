#!/usr/bin/env node

const { createSchema } = require('./nft/create-schema')
const { createTemplate } = require('./nft/create-template')

const COLLECTION_NAME = 'test1test1'
const SCHEMA_NAME = 'test'
const SCHEMA = {
    series: 'uint16',
    name: 'string',
    image: 'string',
}

const templates = [
    { max_supply: 100, series: 1, name: 'Circuits', image: 'QmSZH4X1LqQVscGjvQeVCLUNjxs2ZyFSepisQnd77eXCHw' },
    { max_supply: 100, series: 1, name: 'Fire Keyboard', image: 'QmPLx7CoNmWsZJAe8peoyAiiY5K69W9HepV61NHmKPKimq' },
    { max_supply: 100, series: 1, name: 'Coding left', image: 'QmWYfGbELmYhiPVwurrL71SmdnsP5V1VsvP8AcjqjHaw2e' },
    { max_supply: 100, series: 1, name: 'Coding top', image: 'QmWuTSW2YnmwTqYP73CoCBiWL9F1udMGWyGodrnKEBkujV' },
    { max_supply: 100, series: 1, name: 'Coding right', image: 'QmcTWenDjqGDpJeajiNPHVedZTnNAEgQfgeAPuL2tisnjj' },
    { max_supply: 100, series: 1, name: 'Matrix screen', image: 'QmPpa2WHBBknqYRUcrRqgLicYzGc4KXkgHe1gQhHucJkCZ' },
]

const timer = ms => new Promise(res => setTimeout(res, ms))

const doSchema = async () => {
    await createSchema({
        collection_name: COLLECTION_NAME,
        schema_name: SCHEMA_NAME,
        schema: SCHEMA
    })
}

const doTemplate = async (template) => {
    await createTemplate({
        collection_name: COLLECTION_NAME,
        schema_name: SCHEMA_NAME,
        max_supply: template.max_supply,
        immutable_data: Object.entries(SCHEMA).map(([key, type]) => ({
            key: key,
            value: [type, template[key]]
        }))
    })
}

const main = async () => {
    await doSchema()
    await timer(3000)
    for (i=0;i < templates.length;i++) {
        await doTemplate(templates[i])
        await timer(2000)
    }
}

main()