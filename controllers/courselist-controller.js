const express = require('express')
const router = express.Router()
const ValidationError = require('../errors/validation')
const NotFoundError = require('../errors/not-found')
const { find, findIndex } = require('lodash')
const { uuid } = require('../utils.js')

const courseListCollection = require('../datas/db').courseList

router.post('/', (req, res, next) => {
	if(!req.body.name){
		return next(new ValidationError('Missing name'))
	}

	const name = req.body.name
	const result = find(courseListCollection, { name })
	if(result) {
		return next(new ValidationError('Name should be unique'))
	}

	const newCourseList = {
		id: uuid(),
		name,
		items: []
	}

	courseListCollection.push(newCourseList)

	res.json({ data: newCourseList})
})

router.delete('/', (req, res, next) => {
	if(!req.body.name){
		return next(new ValidationError('Missing name'))
	}

	const name = req.body.name
	const inList = find(courseListCollection, { name })
	if(typeof inList === "undefined"){
		return next(new NotFoundError('List not found'))
	}
	courseListCollection.splice(req.body.id - 1, 1)
	res.json({
		success: {
			code: 204,
			message: 'List deleted'
		}
	})
})

router.get('/', (req, res, next) => {
	res.json(courseListCollection)
})

router.get('/:name', (req, res, next) => {
	const name = req.params.name
	const inLists = find(courseListCollection, {name})
	if(typeof inLists === "undefined"){
		return next(new NotFoundError('List not found'))
	}
	res.json(inLists)
})

router.post('/:name', (req, res, next) => {
	const listName = req.params.name
	const inLists = find(courseListCollection, {name: listName})
	const itemName = req.body.name
	const ListID = findIndex(courseListCollection, {name: listName})

	if(typeof inLists === "undefined"){
		return next(new NotFoundError('List not found'))
	}

	if(!itemName){
		return next(new ValidationError('Missing item name'))
	}

	const ItemInList = find(inLists.items, {name: itemName})
	if(ItemInList){
		return next(new ValidationError('Item already exist'))
	}

	const newItem = {
		id: uuid(),
		name: itemName,
		done: false
	}

	courseListCollection[ListID].items.push(newItem)
	res.json({ data: courseListCollection[ListID] })
})

router.patch('/:name', (req, res, next) => {
	const listName = req.params.name
	const inLists = find(courseListCollection, {name: listName})
	const itemName = req.body.name
	const ListID = findIndex(courseListCollection, {name: listName})

	if(typeof inLists === "undefined"){
		return next(new NotFoundError('List not found'))
	}

	const ItemInList = find(inLists.items, {name: itemName})
	if(typeof ItemInList === "undefined"){
		return next(new NotFoundError('Item not found'))
	}

	const IDItem = findIndex(inLists.items, {name: itemName})
	inLists.items[IDItem].done = true
	res.json({ data: courseListCollection[ListID]})
})

router.delete('/:name', (req, res, next) => {
	const listName = req.params.name
	const inLists = find(courseListCollection, {name: listName})
	const itemName = req.body.name
	const ListID = findIndex(courseListCollection, {name: listName})

	if(!itemName){
		return next(new ValidationError('Missing item name'))
	}
	
	const ItemInList = find(inLists.items, {name: itemName})
	if(typeof ItemInList === "undefined"){
		return next(new NotFoundError('Item not found'))
	}

	const IDItem = findIndex(inLists.items, {name: itemName})
	inLists.items.splice(req.body.IDItem - 1, 1)
	res.json({ data: courseListCollection[ListID]})

})

module.exports = router