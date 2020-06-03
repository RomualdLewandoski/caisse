/**
 * BOXES LIST
 */
const articlesListBox = {
    file: path.join(__dirname, "vue", "articlesList.ejs"),
    div: "#articlesList"
}
const fournisseursListBox = {
    file: path.join(__dirname, "vue", "fournisseursList.ejs"),
    div: "#fournisseursList"
}
const supplierAdd = {
    file: path.join(__dirname, "vue", "supplierAdd.ejs"),
    div: "#supplierAdd"
}

const supplierEdit = {
    file: path.join(__dirname, "vue", "supplierEdit.ejs"),
    div: "#supplierEdit"
}

const supplierView = {
    file: path.join(__dirname, "vue", "supplierView.ejs"),
    div: "#supplierView"
}

const logListBox = {
    file: path.join(__dirname, "vue", "logList.ejs"),
    div: "#logList"
}

const logView = {
    file: path.join(__dirname, "vue", "logView.ejs"),
    div: "#logView"
}

function showBox(box, perms, id = 0) {
    if (perms) {
        if (!boxList.includes(box.div)) {
            ejs.renderFile(box.file, {}, {}, (err, str) => {
                if (err) {
                    console.log(err)
                } else {
                    str = str.replace(/%id%/g, id)
                    $("#adminContainer").append(str)

                    toggleBox(box.div)
                }
            })
        } else {
            toggleBox(box.div)
        }
    } else {
        swal("Oups", "Vous ne possédez pas la permission pour accéder a cette fonction", "error")
    }
}