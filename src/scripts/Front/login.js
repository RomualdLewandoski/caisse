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
        let __OBFID = "07f46a5a-e8bf-4cda-a439-69382bc2cf3a"
        errorHelper.log("doLogin ", __OBFID, err)
    })
}

function loginSuccess() {
    $('#loggedName').html(user.usernameShopLogin)
    $('#loggedNav').show()
    $('#adminNav').show()
    leftBar.generateMenu()
    ejs.renderFile(adminPage, {}, {}, (err, str) => {
        if (err) {
            let __OBFID = "fa038f66-4383-4179-87ef-076f4746467a"
            errorHelper.log("Generating admin page login oK",__OBFID, err)
        } else {
            $("#main").append(str)
        }
    })
    switchView(currentView, VIEWS.admin, 500, 500)

}

function firstLogin() {
    ejs.renderFile(firstLoginPage, {}, {}, (err, str) => {
        if (err) {
            let __OBFID = "b47fde9f-bca1-43ab-9897-8c30709417a3"
            errorHelper.log("Generating firstLoginPage", __OBFID, err)
        } else {
            $("#main").append(str)
            switchView(currentView, VIEWS.firstLogin, 500, 500)
        }
    })
}