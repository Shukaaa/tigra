const normalizeAndFormatRelativePaths = (src, filePathFolder) => {
	while (src.includes("../")) {
		src = src.replace("../", "");
		filePathFolder = filePathFolder.split("\\").slice(0, -1).join("\\");
	}

	src = src
			.replace("./", "")
			.replace(".\\", "")

	while (src.includes("/")) {
		src = src.replace("/", "\\");
	}

	return {
		src,
		filePathFolder
	};
}

module.exports = {
	normalizeAndFormatRelativePaths
}