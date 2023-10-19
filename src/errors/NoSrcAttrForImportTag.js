const {TigraError} = require("./Error");

const error = new TigraError("import tag without src attribute.");

module.exports = {
	NoSrcAttrForImportTag: error
}