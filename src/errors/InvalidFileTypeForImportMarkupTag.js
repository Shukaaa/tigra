const {TigraError} = require("./Error");

const error = new TigraError("invalid file type for import:markup tag. Only .tigra & .html files are allowed.");

module.exports = {
	InvalidFileTypeForImportMarkupTag: error
}