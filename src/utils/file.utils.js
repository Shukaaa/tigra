const fs = require('fs');

const fileReader = (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if(err) reject(err);
			resolve(data);
		});
	});
}

const fileWriter = (path, data) => {
	fs.writeFile(path, data, (err) => {
		if (err) throw err;
		console.log(`The file ${path} has been saved!`);
	});
}

const folderReader = (path) => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			if (err) reject(err);
			resolve(files);
		});
	});
}

module.exports = {
	fileReader,
	fileWriter,
	folderReader
}