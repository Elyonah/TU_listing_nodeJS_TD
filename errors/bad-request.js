const HttpError = require('./http-error')

module.exports = class BadRequestError extends HttpError{
	constructor(message, code) {
		super()
		this.statusCode = 400
		this.code = code || 'BadRequest'
		this.message = message || 'Something is wrong with the request'
	}
}