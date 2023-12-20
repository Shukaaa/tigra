const {fileReader, fileWriter, folderReader} = require("../utils/file.utils");
const cheerio = require("cheerio");
const {NoSrcAttrForImportTag} = require("../errors/NoSrcAttrForImportTag");
const {InvalidFileTypeForImportMarkupTag} = require("../errors/InvalidFileTypeForImportMarkupTag");
const prettify = require("@liquify/prettify");
const {InvalidFileTypeForTemplates} = require("../errors/InvalidFileTypeForTemplates");
const {InvalidAmountOfTemplateOutlets} = require("../errors/InvalidAmountOfTemplateOutlets");
const {removeEmptyLines} = require("../utils/formatting.utils");
const {normalizeAndFormatRelativePaths} = require("../utils/path.utils");
const {NoSrcAttrForTemplateUse} = require("../errors/NoSrcAttrForTemplateUse");
const fs = require("fs");
const path = require("path");

const compileFolder = (folderPath, exportPath, senderPath, exportFolderName) => {
	let newExportPath = senderPath + "\\" + exportFolderName + folderPath.replace(exportPath, "")

	console.log(exportFolderName);

	if (!fs.existsSync(newExportPath)) {
		fs.mkdirSync(newExportPath);
	}

	return new Promise((resolve, reject) => {
		folderReader(folderPath).then(async (files) => {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				if (file.endsWith(".tigra")) {
					compileFile(path.join(senderPath, folderPath, file), newExportPath + "\\" + file.replace(".tigra", ".html"), senderPath);
					continue;
				}

				await compileFolder(folderPath + "\\" + file, exportPath, senderPath)
				resolve();
			}

			resolve();
		}).catch(() => {
			reject();
		});
	});
};

const compileFile = (filePath, exportPath, senderPath) => {
	fileReader(filePath).then(async (data) => {
		let filePathFolder = filePath.split("\\");
		filePathFolder.pop();
		filePathFolder = filePathFolder.join("\\");

		data = await rawCompile(data, filePathFolder);
		fileWriter(exportPath, data);
	}).catch((err) => {
		console.log(err);
	});
};

const rawCompile = async (data, filePathFolder) => {
	const prettifyConfig = {
		indent: 4,
		language: "html"
	}

	let $ = cheerio.load(data);

	const imports = $("import\\:markup");
	for (let i = 0; i < imports.length; i++) {
		const elem = imports[i];
		await handleImportTag(elem, filePathFolder, $);
	}

	const templateUses = $("template\\:use");
	if (templateUses.length >= 1) {
		const elem = templateUses[0];
		const html = await handleTemplateUseTag(elem, filePathFolder, $);
		return removeEmptyLines(await prettify.format(html, prettifyConfig));
	} else {
		return removeEmptyLines(await prettify.format($.html(), prettifyConfig));
	}
}

const handleImportTag = (elem, filePathFolder, $) => {
	let src = elem.attribs.src

	if (!src) {
		NoSrcAttrForImportTag.throw();
	}

	const srcPathsResult = normalizeAndFormatRelativePaths(src, filePathFolder)
	src = srcPathsResult.src
	filePathFolder = srcPathsResult.filePathFolder

	if (!src.endsWith(".html") && !src.endsWith(".tigra")) {
		InvalidFileTypeForImportMarkupTag.throw();
	}

	return fileReader(filePathFolder + "\\" + src).then(async (importData) => {
		if (src.endsWith(".tigra")) {
			const newHtml = cheerio.load(await rawCompile(importData, filePathFolder));
			$(elem).replaceWith(newHtml.html());
		}

		if (src.endsWith(".html")) {
			console.log("html");
			$(elem).replaceWith(importData);
		}
	});
}

const handleTemplateUseTag = (elem, filePathFolder, $) => {
	let src = elem.attribs.src

	$(elem).remove();

	if (!src) {
		NoSrcAttrForTemplateUse.throw();
	}

	const srcPathsResult = normalizeAndFormatRelativePaths(src, filePathFolder)
	src = srcPathsResult.src
	filePathFolder = srcPathsResult.filePathFolder

	if (!src.endsWith(".tigra")) {
		InvalidFileTypeForTemplates.throw();
	}

	return fileReader(filePathFolder + "\\" + src).then(async (importData) => {
		const newHtml = cheerio.load(await rawCompile(importData, filePathFolder));

		if (newHtml("template\\:outlet").length !== 1) {
			InvalidAmountOfTemplateOutlets.throw();
		}

		newHtml("template\\:outlet").replaceWith($.html());
		return newHtml.html();
	});
}

module.exports = {
	compileFolder,
	compileFile
}