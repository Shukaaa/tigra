const {tigraInfo} = require("../../logger/logger");
const minify = require("@node-minify/core");
const minifyUglifyJS = require("@node-minify/uglify-js");
const minifySqwish = require("@node-minify/sqwish");

const minifyTags = async ($, filePathFolder, filePath) => {
    const scripts = $("script");
    for (let i = 0; i < scripts.length; i++) {
        const elem = scripts[i];
        if (elem.attribs.minify === "") {
            let script = elem.children[0].data;

            tigraInfo("Minifying JS at " + filePath);

            await minify({
                compressor: minifyUglifyJS,
                content: script
            }).then((uglified) => {
                elem.children[0].data = uglified;
            }).catch((err) => {
                console.log(err);
            });
        }

        delete elem.attribs.minify;
    }

    const styles = $("style");
    for (let i = 0; i < styles.length; i++) {
        const elem = styles[i];
        if (elem.attribs.minify === "") {
            let style = elem.children[0].data;

            tigraInfo("Minifying CSS at " + filePath);

            await minify({
                compressor: minifySqwish,
                content: style
            }).then((uglified) => {
                elem.children[0].data = uglified;
            }).catch((err) => {
                console.log(err);
            });
        }

        delete elem.attribs.minify;
    }
}

module.exports =  {
    minifyTags
}