const { courseList } = require('../../datas/db')

mockData = [
	{ 
		id: 1, 
		name: 'toto', 
		items: [
			{
				id: 1,
				name: "lait",
				done: false
			},
			{
				id: 2,
				name: "sucre",
				done: false
			}
		]
	},
	{ 
		id: 2, 
		name: 'my list',
		items: [
			{
				id: 1,
				name: "farine",
				done: false
			},
			{
				id: 2,
				name: "oeuf",
				done: false
			}
		]
	}
]

module.exports.up = () => {
	courseList.splice(0)
	courseList.push.apply(courseList, mockData)
}

module.exports.down = () => {
	courseList.splice(0)
}