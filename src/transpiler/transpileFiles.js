const {mkdirSync, existsSync, statSync} = require("fs");
const {folderReader, fileReader, fileWriter} = require("../utils/file.utils");
const {join} = require("path");
const {fullyTranspile} = require("./transpiler");
const {tigraInfo} = require("../logger/logger");

let transpilerQueue = [];

const transpileFolder = async (folderPath, exportPath, senderPath, exportFolderName) => {
    let newExportPath = `${senderPath}\\${exportFolderName}${folderPath.replace(exportPath, "")}`;

    if (!existsSync(newExportPath)) {
        mkdirSync(newExportPath);
    }

    return new Promise((resolve, reject) => {
        folderReader(folderPath).then(async (files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.endsWith(".tigra")) {
                    transpilerQueue.push({
                        filePath: join(senderPath, folderPath, file),
                        exportPath: newExportPath + "\\" + file.replace(".tigra", ".html")
                    });

                    continue;
                }

                if (!statSync(folderPath + "\\" + file).isDirectory()) {
                    continue;
                }

                await transpileFolder(folderPath + "\\" + file, exportPath, senderPath, exportFolderName)
                resolve();
            }

            resolve();
        }).catch(() => {
            reject();
        });
    });
};

const triggerTranspileQueue = async () => {
    const originalQueueLength = transpilerQueue.length;
    while (transpilerQueue.length > 0) {
        const donePercentage = 100 - ((transpilerQueue.length-1) / originalQueueLength) * 100;
        const file = transpilerQueue.shift();

        await transpileFile(file.filePath, file.exportPath, donePercentage)
    }
}

const transpileFile = async (filePath, exportPath, donePercentage = 100) => {
    await fileReader(filePath).then(async (data) => {
        let filePathFolder = filePath.split("\\");
        filePathFolder.pop();
        filePathFolder = filePathFolder.join("\\");

        data = await fullyTranspile(data, filePathFolder, filePath, false)
        fileWriter(exportPath, data);
        tigraInfo(`Compiled ${exportPath} [${donePercentage.toFixed(0)}%]`);
    }).catch((err) => {
        console.log("Error while compiling " + filePath, err);
    });
};

module.exports = {
    transpileFolder,
    transpileFile,
    triggerTranspileQueue
}