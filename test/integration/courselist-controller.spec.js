const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()
const { find } = require('lodash')

const app = require('../../app')
const courseListFixture = require('../fixtures/courseList')

const courseListCollection = require('../../datas/db').courseList

describe('CourseListController', () => {
	beforeEach(() => { courseListFixture.up() })
	afterEach(() => { courseListFixture.down() })

	describe('when i create a courseList (POST /course-lists', () => {
		it('should reject with a 400 when no name is given', () => {
			return request(app).post('/course-lists').then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Missing name'
					}
				})
			})
		})
		it('should reject when name is not unique', () => {
			return request(app).post('/course-lists')
			.send({ name: 'toto'})
			.then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Name should be unique'
					}
				})
			})
		})
		it('should successfully create a course list with a name', () => {
			const mockName = 'My new list'
			return request(app).post('/course-lists')
			.send({ name: mockName })
			.then((res) => {
				res.status.should.equal(200)
				expect(res.body.data).to.be.an('object')
				res.body.data.name.should.equal(mockName)
				const result = find(courseListCollection, { name: mockName})
				result.should.not.be.empty
				result.should.eql({
					id: res.body.data.id,
					name: res.body.data.name,
					items: []
				})
			})
		})
	})

	describe('when i delete a courseList (DELETE /course-lists', () => {
		it('shouldnt delete a courseList with no name', () => {
			return request(app).delete('/course-lists')
			.then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Missing name'
					}
				})
			})
		})
		it('shouldnt delete a courseList if name is not found', () => {
			const mockName = 'test'
			return request(app).delete('/course-lists')
			.send({name : mockName})
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'List not found'
					}
				})
			})
		})
		it('should delete a courseList with a name', () => {
			const mockName = 'toto'
			return request(app).delete('/course-lists')
			.send({name: mockName})
			.then((res) => {
				res.status.should.equal(200)
				res.body.should.eql({
					success: {
						code: 204,
						message: 'List deleted'
					}
				})
			})
		})
	})
	describe('when i display courseList (GET /course-lists)', () => {
		it('should display all courseList if no name is given', () => {
			return request(app).get('/course-lists')
			.then((res) => {
				res.status.should.equal(200)
				res.body.should.eql(courseListCollection)
			})
		})
	})
	describe('when i display one list (GET /course-lists/:list)', () => {
		it('shouldnt display the list if it doesnt exist', () => {
			const mockName = 'this list doesnt exist'
			return request(app).get('/course-lists/'+mockName)
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'List not found'
					}
				})
			})
		})
		it('should display the list if the list exist', () => {
			const mockName = 'toto'
			return request(app).get('/course-lists/'+mockName)
			.then((res) => {
				const result = find(courseListCollection, { name: mockName})
				res.status.should.equal(200)
				res.body.should.eql(result)
			})
		})
	})
	describe('when i add an item in a list (POST /course-lists/:list)', () => {
		it('shouldnt add an item if the list is not found', () => {
			const mockName = 'this list doesnt exist'
			return request(app).post('/course-lists/'+mockName)
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'List not found'
					}
				})
			})
		})
		it('shouldnt add an item if the item name is not given', () => {
			const mockName = 'toto'
			return request(app).post('/course-lists/'+mockName)
			.then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Missing item name'
					}
				})
			})
		})
		it('shouldnt add an item if the item already exist in the list', () => {
			const mockName = 'toto'
			const itemName = 'lait'
			return request(app).post('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Item already exist'
					}
				})
			})
		})
		it('should add successfully an item with a name', () => {
			const mockName = 'toto'
			const itemName = 'this item doesnt exist'
			return request(app).post('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(200)
				const list = find(courseListCollection, {name: mockName})
				res.body.should.eql({
					data: list
				})
			})
		})
	})
	describe('when i update an item in a list (PATCH /course-lists/:list/:item)', () => {
		it('shoulnd update an item in a list if the list isnt found', () => {
			const mockName = 'this list doesnt exist'
			const itemName = 'chocolat'
			return request(app).patch('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'List not found'
					}
				})
			})
		})
		it('shoulnd update an item in the item isnt found', () => {
			const mockName = 'toto'
			const itemName = 'chocolat'
			return request(app).patch('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'Item not found'
					}
				})
			})
		})
		it('shoul update successfully an item with a name', () => {
			const mockName = 'toto'
			const itemName = 'lait'
			return request(app).patch('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(200)
				const list = find(courseListCollection, {name: mockName})
				res.body.should.eql({
					data: list
				})
			})
		})
	})
	describe('when i delete an item in a list (DELETE /course-lists/:list/)', () => {
		it('shouldnt delete an item without a name', () => {
			const mockName = 'toto'
			return request(app).delete('/course-lists/'+mockName)
			.then((res) => {
				res.status.should.equal(400)
				res.body.should.eql({
					error: {
						code: 'Validation',
						message: 'Missing item name'
					}
				})
			})
		})
		it('shouldnt delete an item if it dont exist', () => {
			const mockName = 'toto'
			const itemName = 'this item doesnt exist 2'
			return request(app).delete('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(404)
				res.body.should.eql({
					error: {
						code: 'NotFound',
						message: 'Item not found'
					}
				})
			})
		})
		it('should delete an item successfully', () => {
			const mockName = 'toto'
			const itemName = 'lait'
			return request(app).delete('/course-lists/'+mockName)
			.send({name: itemName})
			.then((res) => {
				res.status.should.equal(200)
				const list = find(courseListCollection, {name: mockName})
				res.body.should.eql({
					data: list
				})
			})
		})
	})
})