const request = require('supertest')
require('chai').should

const app = require('./../app')

describe('Index', () => {
    xit('should pass', () => {
        return request(app).get('/').then((res) => {
            res.status.should.equal(200)

            res.body.status.should.equal('success')
            res.body.data.should.be.an('object')

            res.body.data.user.should.eql({
                list: {
                    id: 1,
                    name: "List1",
                    items: {
                        item: {
                            name: "Farine",
                            bought: false
                        },
                        item: {
                            name: "Lait",
                            bought: false
                        }
                        
                    }
                }
            })
        })
    })
})