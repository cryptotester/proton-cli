const expect = require('chai').expect
const { getQuantity, getHumanFriendlyAmount, getQuantityFromPriceListing } = require('../utils')

describe('getQuantity()', function() {
    const tests = [
        {name : 'FOOBAR integer', amount: 1, symbol: 'FOOBAR', expected: '1.000000 FOOBAR'},
        {name : 'XPR integer lowercase', amount: 100, symbol: 'xpr', expected: '100.0000 XPR'},
        {name : 'XPR with decimals', amount: 1.0001, symbol: 'XPR', expected: '1.0001 XPR'},
        {name : 'XPR with too many decimals (rounded minus)', amount: 1.00004, symbol: 'XPR', expected: '1.0000 XPR'},
        {name : 'XPR with too many decimals (rounded plus)', amount: 1.00005, symbol: 'XPR', expected: '1.0001 XPR'},
        ];

    tests.forEach((test) => {
        it(test.name, function() {
            const result = getQuantity(test.amount, test.symbol)
            expect(result).to.equal(test.expected)
        })
    })
})

describe('getHumanFriendlyAmount()', function() {
    const tests = [
        {name : 'FOOBAR integer', amount: 1000000, symbol: 'FOOBAR', expected: 1},
        {name : 'FOOBAR float', amount: 1100000, symbol: 'FOOBAR', expected: 1.1},
        {name : 'FOOBAR float', amount: 1000001, symbol: 'FOOBAR', expected: 1.000001},
        {name : 'FOOBAR float', amount: 0000001, symbol: 'FOOBAR', expected: 0.000001},
      ];

    tests.forEach((test) => {
        it(test.name, function() {
            const result = getHumanFriendlyAmount(test.amount, test.symbol)
            expect(result).to.equal(test.expected)
        })
    })
})

describe('getQuantityFromPriceListing()', function() {
    const tests = [
        {name : 'XPR integer', price: { amount: 10000, token_symbol: 'XPR', token_precision: 4}, expected: '1.0000 XPR'},
        {name : 'ABC float', price: { amount: 1005, token_symbol: 'ABC', token_precision: 3}, expected: '1.005 ABC'},
      ];

    tests.forEach((test) => {
        it(test.name, function() {
            const result = getQuantityFromPriceListing(test.price)
            expect(result).to.equal(test.expected)
        })
    })
})