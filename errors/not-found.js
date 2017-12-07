const HttpError = require('./http-error')

module.exports = class NotFoundError extends HttpError{
	constructor(message, code) {
		super()
		this.statusCode = 404
		this.code = code || 'NotFound'
		this.message = message || 'Page not found'
	}
}