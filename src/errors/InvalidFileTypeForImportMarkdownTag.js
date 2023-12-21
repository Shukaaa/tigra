const {TigraError} = require("./Error");

const error = new TigraError("invalid file type for import:markdown tag. Only .md files are allowed.");

module.exports = {
	InvalidFileTypeForImportMarkdownTag: error
}