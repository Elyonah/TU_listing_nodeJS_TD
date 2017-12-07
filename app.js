const express = require('express')
const app = express()
const PORT = 3000
const bodyParser = require('body-parser')
const HttpError = require('./errors/http-error')
const NotFoundError = require('./errors/not-found')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const courseListRouter = require('./controllers/courselist-controller')

app.use('/course-lists', courseListRouter)

app.use((req, res, next) => {
	next(new NotFoundError())
})

app.use((err, req, res, next) => {
	if(!(err instanceof HttpError)) {
		console.error(err)
		err = new HttpError(err.message || 'Unknown error')
	}
	res.status(err.statusCode)
	res.json({
		error: err
	})
})

if(!module.parent){
	app.listen(PORT, () => {
		console.log('Server launched on port', PORT)
	})
}

module.exports = app