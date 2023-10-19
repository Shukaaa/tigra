#! /usr/bin/env node
const yargs = require("yargs");
const {handleCommand} = require("../processor/command.processor");

const usage = "" +
		"\nCreate a new Tigra project:\ntigra new <name>\n\n" +
		"Compile a Tigra project:\ntigra compile <file> or tigra compile <page-folder>\n\n" +
		"Serve a Tigra project:\ntigra serve <file> or tigra serve <page-folder>";
yargs
		.usage(usage)
		//.option("l", {alias:"languages", describe: "List all supported languages.", type: "boolean", demandOption: false })
		.help(true)
		.argv;

const cmdOptions = yargs.argv;
delete cmdOptions._;

const cmdInformation = {
	args: yargs.argv._,
	options: cmdOptions,
	senderPath: process.cwd()
};

handleCommand(cmdInformation);