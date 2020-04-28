loggerLogin.log("Login Initializing..")
$('#loginForm').submit(function (e) {
    e.preventDefault()
    doLogin($('#username').val(), $('#password').val())
})

function doLogin(userName, pass) {
    userHelper.loginUser(userName, pass).then((r) => {
        if (r.state) {
            if (!r.default) {
                loginSuccess()
            } else {
                firstLogin()
            }
        }
    }).catch((err) => {
        errorHelper.log("doLogin ", err)
    })
}

function loginSuccess() {
    $('#loggedName').html(user.usernameShopLogin)
    $('#loggedNav').show()
    if (user.hasAdmin) {
        $('#adminNav').show()
        ejs.renderFile(adminPage, {}, {}, (err, str) => {
            if (err) {
                console.log(err)
                errorHelper.log("Generating admin page login oK", err)
            } else {
                $("#main").append(str)
            }
        })
        switchView(currentView, VIEWS.admin, 500, 500)
    } else {
        $('#adminNav').hide()
    }
}

function firstLogin() {
    ejs.renderFile(firstLoginPage, {}, {}, (err, str) => {
        if (err) {
            errorHelper.log("Generating firstLoginPage", err)
        } else {
            $("#main").append(str)
            switchView(currentView, VIEWS.firstLogin, 500, 500)
        }
    })
}