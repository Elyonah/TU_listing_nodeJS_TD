const request = require('supertest')
require('chai').should()

const app = require('./../../app')

describe('Http Errors', () => {
	describe('when route doesnt exist', () => {
		it('should return a 404', () => {
			return request(app).get('/i-know-it-doesnt-exist').then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'Page not found'
					}
				})
			})
		})
	})
})