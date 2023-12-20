const {TigraError} = require("./Error");

const error = new TigraError("required attributes not passed.");

module.exports = {
	RequiredAttributesNotPassed: error
}