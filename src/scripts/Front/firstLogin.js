loggerLogin.log("firstLogin Initializing..")

$('#firstLoginForm').submit(function (e) {
    e.preventDefault();
    let password = $('#pass01').val()
    let conf = $('#pass02').val()
    changePass(password, conf)
})

function changePass(password, conf) {
    if (password != "") {
        if (password == conf) {
            userHelper.changePass(user.idWp, password).then((r) => {
                console.log(r)
            })
        } else {
            genericErr("Le mot de passe et sa confirmation ne correspondent pas")
        }
    } else {
        genericErr("Votre mot de passe ne peut etre vide")
    }
}

function genericErr(err) {
    swal('Erreur', err, "error")
}