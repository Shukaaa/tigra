const {TigraError} = require("./Error");

const error = new TigraError("template:use without src attribute.");

module.exports = {
	NoSrcAttrForTemplateUse: error
}