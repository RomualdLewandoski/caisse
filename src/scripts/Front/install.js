loggerInstall.log('Install Initializing...')
$('#installForm').submit(function (e) {
    e.preventDefault();
    doInstall($('#installContent').val())
})

function doInstall(post) {
    let obj = null;
    try {
        obj = JSON.parse(post)
    }catch (e) {
        console.error(e)
    }
    if (obj == null){
        swal("Erreur", "Le script d'installation ne semble pas valide merci de re essayer", "error")
    }else{
        config.saveConfig(obj).then(function () {
            swal("Bravo", "La configuration a bien été enregistrée merci de redémarer la caisse pour effectuer la mise a jour", "success")
            setTimeout(function () {
                let window = remote.getCurrentWindow()
                window.close()
            }, 3000)
        }).catch(function (e) {
            console.error(e)
        })
    }
}