const configFile = configFolder + "/config.json"

async function loadJson() {
    try {
        var data = fs.readFileSync(configFile, 'utf8')
        var obj = JSON.parse(data)
        return obj;
    } catch (err) {
        return null
    }


}

module.exports.loadJson = loadJson();
module.exports.saveConfig = async function (obj) {
    let sObj = JSON.stringify(obj);
    try {
        let data = fs.writeFileSync(configFile, sObj);
    } catch (e) {
        console.error(e)
    }

}