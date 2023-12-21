const {compileFile, compileFolder} = require("../compiler/compiler");
const fs = require("fs");
const path = require("path");
const colors = require('colors');
const {tigraError, tigraInfo} = require("../logger/logger");
colors.enable();

const handleCommand = (cmdInformation) => {
	switch (cmdInformation.args[0]) {
		case "new":
			cmdNew();
			break;
		case "compile":
			const compilePath = cmdInformation.args[1];
			let compileFolderName = cmdInformation.options.outDir;

			if (!compileFolderName) {
				compileFolderName = "out";
			}

			cmdCompile(compilePath, cmdInformation.senderPath, compileFolderName);
			break;
		default:
			tigraError("Invalid command. Use tigra --help to see the available commands.");
	}
}

function cmdNew() {
	tigraInfo("Creating new Tigra project...");
}

function cmdCompile(compilePath, senderPath, compileFolderName) {
	tigraInfo("Compiling...")

	if (!compilePath) {
		tigraError("No file or folder specified.")
		return;
	}

	if (compilePath.endsWith(".tigra")) {
		const fileName = compilePath.split("\\")[compilePath.split("\\").length - 1].toString().replace(".tigra", ".html");

		if (!fs.existsSync(senderPath + "\\" + compileFolderName)) {
			tigraInfo("Creating folder " + compileFolderName + " in " + senderPath + "...");
			fs.mkdirSync(senderPath + "\\" + compileFolderName);
		}

		compileFile(compilePath,  path.join(senderPath, compileFolderName, fileName), senderPath);
	} else {
		compileFolder(compilePath, compilePath, senderPath, compileFolderName).catch((err) => {
			tigraError(err);
		});
	}
}

module.exports = {
	handleCommand
}