const {TigraError} = require("./Error");

const error = new TigraError("attributes defined with the same name.");

module.exports = {
	AttributesDefinedWithTheSameName: error
}