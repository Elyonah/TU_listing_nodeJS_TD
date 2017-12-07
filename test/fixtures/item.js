const { items } = require('../../datas/db')

mockData = [
	{ id: 1, name: 'farine'},
	{ id: 2, name: 'oeuf'}
]

module.exports.up = () => {
	items.splice(0)
	items.push.apply(items, mockData)
}

module.exports.down = () => {
	items.splice(0)
}