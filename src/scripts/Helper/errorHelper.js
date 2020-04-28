module.exports.log = function (action, err) {
    //todo here we ll generate our error and append it to file
    // todo then we ll generate an alert to say an internal error was encountered it has been logged on file
    var file = errorFolder + "/" + errFile;
    let d = new Date();
    var content =
        "---------------------------\n" +
        "[" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
        + "-" +
        (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth())
        + "-" + d.getFullYear()
        + " - " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
        + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes())
        + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds())
        + "] \n+++" + action + " : \n+++" + err + "\n"
    fs.closeSync(fs.openSync(file, 'a'));

    try {
        let data = fs.writeFileSync(file, content, {flag: 'a+'})
        alert("Une erreur interne a été détectée cette erreur a été enregistrée dans le fichier " + file + " Si a caisse ne semble plus répondre merci de la redémarrer")
    } catch (e) {
        console.error(e)
    }

}