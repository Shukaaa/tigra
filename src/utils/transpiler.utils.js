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

module.exports = {
    addCustomData
}