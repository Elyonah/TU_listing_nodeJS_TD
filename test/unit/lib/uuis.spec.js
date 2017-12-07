const request = require('supertest')
require('chai').should()

const app = require('./../../../app')
const utils = require('../../../utils')

describe('UUID', () => {
    it('Should return a string with the UUID format', () => {
        const actual = utils.uuid()
        const expected = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i
        const result = expected.test(actual);
        result.should.be.equal(true)
    })
    it('Should return two differents UUIDS', () => {
        const actual1 = utils.uuid()
        const actual2 = utils.uuid()
        actual1.should.not.be.equal(actual2)
    })
})