const removeEmptyLines = (data) => {
	const lines = data.split("\n");
	let newData = "";

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.trim() !== "") {
			newData += line + "\n";
		}
	}

	return newData;
}

module.exports = {
	removeEmptyLines
}