const docsiConfig = {
  // Order how pages are merged together
  pageOrder: [
    "1-Introduction",
    "2-TigraBasics",
    "3-QoLFeatures",
  ],
  build: {
    minifyJs: true,
    minifyCss: true,
    buildDir: "dist"
  },
  fileLocations: {
    template: "src/template.html"
  },
  folderLocations: {
    assets: "../../../assets",
    pages: "../..",
    css: "src/css",
    js: "src/js"
  },
  // Custom markdown compiler options
  markdown: {
    preCompile: (md) => {
      // checkbox - [ ] || - [x]
      md = md.replace(/- \[ ]/g, '- <input type="checkbox" disabled>');
      md = md.replace(/- \[x]/g, '- <input type="checkbox" checked disabled>');

      // mark special words ==word==
      md = md.replace(/==(.+?)==/g, '<mark>$1</mark>');

      // sup numbers ^2^ to <sup>2</sup>
      md = md.replace(/\^(\d+)\^/g, '<sup>$1</sup>');

      return md;
    },
    postCompile: (html) => {
      return html;
    }
  }
}

module.exports = docsiConfig;