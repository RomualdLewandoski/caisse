const notification = document.getElementById('notification');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function doUpdate() {
    ipcRenderer.send('restart_app');
}

function isAdmin() {
    if (localStorage.getItem('perms') == 999) {
        return true;
    } else {
        return false;
    }
}

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


//TODO HERE WE LL DEFINE ALL OF THE NAV ACTION
$('#navArticlesList').click(function () {
    showBox(articlesListBox)
});
$('#navFournisseursList').click(function () {
    showBox(fournisseursListBox)
});

function showBox(box) {
    if (isAdmin()) {
        if (!boxList.includes(box.div)) {
            ejs.renderFile(box.file, {}, {}, (err, str) => {
                if (err) {
                    console.log(err)
                } else {
                    $("#adminContainer").append(str)
                    toggleBox(box.div)
                }
            })
        }else{
            toggleBox(box.div)
        }
    } else {
        swal("Oups", "Vous devez être administrateur pour accéder a cette fonction", "error")
    }
}