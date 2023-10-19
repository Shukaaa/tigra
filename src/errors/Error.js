class TigraError {
	constructor(message) {
		this.message = message;
	}

	throw() {
		throw new Error(this.message);
	}
}

module.exports = {
	TigraError
}