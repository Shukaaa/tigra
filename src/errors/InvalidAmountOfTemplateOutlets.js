const {TigraError} = require("./Error");

const error = new TigraError("You can only use templates when 1 template:outlet is defined.");

module.exports = {
	InvalidAmountOfTemplateOutlets: error
}