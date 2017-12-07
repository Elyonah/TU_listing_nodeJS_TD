const BadRequestError = require('./bad-request')

module.exports = class ValidationError extends BadRequestError{
	constructor(message, code) {
		super()
		this.code = code || 'Validation'
		this.message = message || 'A validation error occured'
	}
}