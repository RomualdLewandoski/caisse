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
                if (r.state == true) {
                    $('#loggedName').html(user.usernameShopLogin)
                    $('#loggedNav').show()
                    leftBar.generateMenu()
                    $('#adminNav').show()
                    ejs.renderFile(adminPage, {}, {}, (err, str) => {
                        if (err) {
                            console.log(err)
                            let __OBFID = "a0f38117-4ad0-4286-87b4-8b2dfa1e43e0"
                            errorHelper.log("Generating admin page login oK", __OBFID, err)
                        } else {
                            $("#main").append(str)
                        }
                    })
                    switchView(currentView, VIEWS.admin, 500, 500)

                } else {
                    swal("Erreur", "La modification du mot de passe a échouée", "error")
                }
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