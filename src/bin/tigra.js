#! /usr/bin/env node
const yargs = require("yargs");
const {handleCommand} = require("../processor/command.processor");
const colors = require('colors');
colors.enable();

const npmPackage = require("../../package.json");
const packageVersion = npmPackage.version;

const usage =
	"🐯 Tigra CLI - Help 🐯".bgYellow.underline + "\n" +
    "\nCreate a new Tigra project: " + "tigra new <name>".bgYellow + "\n" +
    "Compile a Tigra project: " + "tigra compile <file>".bgYellow + " or " + "tigra compile <page-folder>".bgYellow;

yargs
	.help(true)
	.version(packageVersion)
	.alias("v", "version")
	.alias("h", "help")
    .usage(usage)
    .argv;

const cmdOptions = yargs.argv;
delete cmdOptions._;

const cmdInformation = {
    args: yargs.argv._,
    options: cmdOptions,
    senderPath: process.cwd()
};

console.log("🐯 Tigra CLI 🐯".bgYellow.underline);

handleCommand(cmdInformation);