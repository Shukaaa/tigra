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
const {AttributesDefinedWithTheSameName} = require("../errors/AttributesDefinedWithTheSameName");
const {RequiredAttributesNotPassed} = require("../errors/RequiredAttributesNotPassed");

const compileFolder = (folderPath, exportPath, senderPath) => {
	let newExportPath = senderPath + "\\out" + folderPath.replace(exportPath, "")

	if (!fs.existsSync(newExportPath)) {
		fs.mkdirSync(newExportPath);
	}

	return new Promise((resolve, reject) => {
		folderReader(folderPath).then(async (files) => {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				if (file.endsWith(".tigra")) {
					compileFile(folderPath + "\\" + file, newExportPath + "\\" + file.replace(".tigra", ".html"), senderPath);
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
		const filePathFolders = filePath
				.replace("./", "")
				.replace(".\\", "")
				.split("\\")
				.slice(0, -1);

		const filePathFolder = filePathFolders.join("\\");

		data = await rawCompile(data, senderPath + "\\" + filePathFolder);
		fileWriter(exportPath, data);
	}).catch((err) => {
		console.log(err);
	});

	console.log("a")
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

	let attributeValues = {}
	for (const [key, value] of Object.entries(elem.attribs)) {
		if (key.startsWith("attr-")) {
			attributeValues[key.replace("attr-", "")] = value;
		}
	}

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

		let customAttributes = {}
		if (newHtml("attribute\\:define").length !== 0) {
			newHtml("attribute\\:define").each((i, elem) => {
				const name = elem.attribs.name;
				const value = elem.attribs["default-value"];

				if (Object.keys(customAttributes).includes(name)) {
					AttributesDefinedWithTheSameName.throw();
				}

				customAttributes[name] = value;
			});
		}

		newHtml("template\\:outlet").replaceWith($.html());

		let attributeDefines = newHtml("attribute\\:define");
		for (let i = 0; i < attributeDefines.length; i++) {
			const elem = attributeDefines[i];
			$(elem).remove();
		}

		let html = newHtml.html();
		for (const [key, value] of Object.entries(customAttributes)) {
			const attributeValue = attributeValues[key];
			let replaceValue = value;

			if (value === undefined && attributeValue === undefined) {
				RequiredAttributesNotPassed.throw();
			}

			if (attributeValue !== undefined) {
				replaceValue = attributeValue;
			}

			html = html.replace("{{ " + key + " }}" , replaceValue);
		}

		return html;
	});
}

module.exports = {
	compileFolder,
	compileFile
}