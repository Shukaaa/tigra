const {compileFile, compileFolder} = require("../compiler/compiler");
const fs = require("fs");
const path = require("path");

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
		case "serve":
			cmdServe();
			break;
		default:
			console.log("Invalid command. Use tigra --help to see the available commands.");
	}
}

function cmdNew() {
	console.log("new")
}

function cmdCompile(compilePath, senderPath, compileFolderName) {
	if (!compilePath) {
		console.log("You need to specify a file or folder to compile. See tigra --help for more information.");
		return;
	}

	if (compilePath.endsWith(".tigra")) {
		const fileName = compilePath.split("\\")[compilePath.split("\\").length - 1].toString().replace(".tigra", ".html");

		if (!fs.existsSync(senderPath + "\\out")) {
			console.log("Creating out folder...");
			fs.mkdirSync(senderPath + "\\out");
		}

		compileFile(compilePath,  path.join(senderPath, compileFolderName, fileName), senderPath);
	} else {
		compileFolder(compilePath, compilePath, senderPath, compileFolderName).catch((err) => {
			console.log(err);
		});
	}
}

function cmdServe() {
	console.log("serve")
}

module.exports = {
	handleCommand
}