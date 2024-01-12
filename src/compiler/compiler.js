const {fileReader, fileWriter, folderReader} = require("../utils/file.utils");
const cheerio = require("cheerio");
const {NoSrcAttrForImportTag} = require("../errors/NoSrcAttrForImportTag");
const {InvalidFileTypeForImportMarkupTag} = require("../errors/InvalidFileTypeForImportMarkupTag");
const prettify = require("@liquify/prettify");
const {InvalidFileTypeForTemplates} = require("../errors/InvalidFileTypeForTemplates");
const {InvalidAmountOfTemplateOutlets} = require("../errors/InvalidAmountOfTemplateOutlets");
const {removeEmptyLines} = require("../utils/formatting.utils");
const {NoSrcAttrForTemplateUse} = require("../errors/NoSrcAttrForTemplateUse");
const fs = require("fs");
const path = require("path");
const {tigraWarning} = require("../logger/logger");
const {InvalidFileTypeForImportMarkdownTag} = require("../errors/InvalidFileTypeForImportMarkdownTag");
const {marked} = require("marked");

const compileFolder = async (folderPath, exportPath, senderPath, exportFolderName) => {
    let newExportPath = `${senderPath}\\${exportFolderName}${folderPath.replace(exportPath, "")}`;

    if (!fs.existsSync(newExportPath)) {
        fs.mkdirSync(newExportPath);
    }

    return new Promise((resolve, reject) => {
        folderReader(folderPath).then(async (files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.endsWith(".tigra")) {
                    compileFile(path.join(senderPath, folderPath, file), newExportPath + "\\" + file.replace(".tigra", ".html"));
                    continue;
                }

                if (!fs.statSync(folderPath + "\\" + file).isDirectory()) {
                    continue;
                }

                await compileFolder(folderPath + "\\" + file, exportPath, senderPath, exportFolderName)
                resolve();
            }

            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const compileFile = (filePath, exportPath) => {
    fileReader(filePath).then(async (data) => {
        let filePathFolder = filePath.split("\\");
        filePathFolder.pop();
        filePathFolder = filePathFolder.join("\\");

        data = await rawCompile(data, filePathFolder);
        fileWriter(exportPath, data);
    }).catch((err) => {
        console.log("Error while compiling " + filePath, err);
    });
};

const rawCompile = async (data, filePathFolder) => {
    if (isCompiled(filePathFolder)) {
        return getCompiled(filePathFolder);
    }

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

    const markdownImports = $("import\\:markdown");
    for (let i = 0; i < markdownImports.length; i++) {
        const elem = markdownImports[i];
        await handleMarkdownImportTag(elem, filePathFolder, $);
    }

    const templateUses = $("template\\:use");
    if (templateUses.length >= 1) {
        const elem = templateUses[0];
        const html = await handleTemplateUseTag(elem, filePathFolder, $);
        const clearedHtml = removeEmptyLines(await prettify.format(html, prettifyConfig));

        compiledFileCache.push({
            path: filePathFolder,
            html: clearedHtml
        });

        return clearedHtml
    } else {
        const clearedHtml = removeEmptyLines(await prettify.format($.html(), prettifyConfig));

        compiledFileCache.push({
            path: filePathFolder,
            html: clearedHtml
        });

        return clearedHtml
    }
}

const addCustomData = (customDataArr, elem) => {
    for (let attr in elem.attribs) {
        if (attr.startsWith("data-")) {
            customDataArr.push({
                name: attr.replace("data-", ""),
                value: elem.attribs[attr]
            });
        }
    }
}

let compiledFileCache = [];

const isCompiled = (filePath) => {
    return compiledFileCache.find((file) => {
        return file.path === filePath;
    });
}

const getCompiled = (filePath) => {
    return compiledFileCache.find((file) => {
        return file.path === filePath;
    }).html;
}

const handleImportTag = (elem, filePathFolder, $) => {
    let src = elem.attribs.src

    let customData = []
    addCustomData(customData, elem)

    if (!src) {
        NoSrcAttrForImportTag.throw();
    }

    if (!src.endsWith(".html") && !src.endsWith(".tigra")) {
        InvalidFileTypeForImportMarkupTag.throw();
    }

    return fileReader(path.join(filePathFolder, src)).then(async (importData) => {
        if (src.endsWith(".tigra")) {
            const newHtml = cheerio.load(await rawCompile(importData, path.join(filePathFolder, src, "../")));

            newHtml("import\\:data").each((i, elem) => {
                const data = customData.find((data) => {
                    return data.name === elem.attribs.name;
                });

                if (data) {
                    newHtml(elem).replaceWith(data.value)
                } else {
                    newHtml(elem).remove();
                    tigraWarning(`Import data ${elem.attribs.name} not found. [${src}]`)
                }
            });

            $(elem).replaceWith(newHtml.html());
        }

        if (src.endsWith(".html")) {
            if (customData.length > 0) {
                tigraWarning(`Custom data is not supported for HTML imports. [${src}]`)
            }

            $(elem).replaceWith(importData);
        }
    });
}

const handleMarkdownImportTag = (elem, filePathFolder, $) => {
    let src = elem.attribs.src

    if (!src) {
        NoSrcAttrForImportTag.throw();
    }

    console.log(src);

    if (!src.endsWith(".md")) {
        InvalidFileTypeForImportMarkdownTag.throw();
    }

    return fileReader(path.join(filePathFolder, src)).then(async (importData) => {
        $(elem).replaceWith(marked(importData));
    });
}

const handleTemplateUseTag = (elem, filePathFolder, $) => {
    let src = elem.attribs.src

    let customData = []
    addCustomData(customData, elem)

    $(elem).remove();

    if (!src) {
        NoSrcAttrForTemplateUse.throw();
    }

    if (!src.endsWith(".tigra")) {
        InvalidFileTypeForTemplates.throw();
    }

    return fileReader(path.join(filePathFolder, src)).then(async (importData) => {
        const newHtml = cheerio.load(await rawCompile(importData, path.join(filePathFolder, src, "../")));

        if (newHtml("template\\:outlet").length !== 1) {
            InvalidAmountOfTemplateOutlets.throw();
        }

        newHtml("template\\:data").each((i, elem) => {
            const data = customData.find((data) => {
                return data.name === elem.attribs.name;
            });

            if (data) {
                newHtml(elem).replaceWith(data.value)
            } else {
                newHtml(elem).remove();
                tigraWarning(`Template data ${elem.attribs.name} not found. [${src}]`)
            }
        });

        newHtml("meta[inject-title]").each((i, elem) => {
            const data = customData.find((data) => {
                return data.name === elem.attribs.name;
            });

            if (data) {
                newHtml(elem).remove();

                if (newHtml("title").length === 0) {
                    newHtml("head").append("<title></title>");
                }

                newHtml("title").text(data.value);
            } else {
                newHtml(elem).remove();
                tigraWarning(`Template data ${elem.attribs.name} not found. [${src}]`)
            }
        });

        newHtml("template\\:outlet").replaceWith($.html());

        return newHtml.html();
    });
}

module.exports = {
    compileFolder,
    compileFile
}