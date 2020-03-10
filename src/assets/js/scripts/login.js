loggerLogin.log("Login Initializing..")
$('#loginForm').submit(function (e) {
    e.preventDefault()
    doLogin($('#username').val(), $('#password').val())
})

var fakeAdmin = {
    user: "Admin",
    perms: 999,
    view: VIEWS.admin
}

var fakeUser = {
    user: "Vendeur",
    perms: 1,
    view: VIEWS.landing
}

var fakePass = "0000"

function doLogin(userName, pass) {
    var response =  new Promise(function (resolve, reject) {
        if (userName === "admin" && pass === fakePass){
            resolve(loginSuccess(fakeAdmin))
        }else if (userName === "vendeur" && pass === fakePass){
            resolve(loginSuccess(fakeUser))
        }else{
            resolve(loginFailed("nop"))
        }
    })
    response.then(() => {})
}

function loginSuccess(data) {
    console.log(data)
    localStorage.setItem('user', data.user)
    localStorage.setItem('perms', data.perms)
    $('#loggedName').html(data.user)
    $('#loggedSubBox').html(data.user + "<small>"+data.perms+"</small>")
    $('#loggedNav').show()
    if (data.perms === 999){
        $('#adminNav').show()
        ejs.renderFile(adminPage, {}, {}, (err, str) => {
            if (err) {
                console.log(err)
            } else {
                $("#main").append(str)
            }
        })
        switchView(currentView, VIEWS.admin, 500, 500)
    }else{
        $('#adminNav').hide()
    }
}

function loginFailed(data) {
    console.log(data)
    swal("Oups", "Vos identifiants ne sont pas valides", "error")
}