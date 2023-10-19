const {TigraError} = require("./Error");

const error = new TigraError("invalid file type for template:use tag. Only .tigra files are allowed.");

module.exports = {
	InvalidFileTypeForTemplates: error
}