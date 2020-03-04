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
    //TODO HERE COMES THE AJAX REQUEST WHEN IT LL BE DONE
    //TODO WE LL STORE HERE IN LOCALSTORAGE THE USER INFO AND THE VIEW
    //TODO WHEN APP IS LAUNCHED WE CLEAR BOTH LocalStorageUser and VIEW
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
    localStorage.setItem('view', data.view)
    localStorage.setItem('perms', data.perms)
    $('#loggedName').html(data.user)
    $('#loggedSubBox').html(data.user + "<small>"+data.perms+"</small>")
    $('#loggedNav').show()
    if (data.perms === 999){
        $('#adminNav').show()
    }else{
        $('#adminNav').hide()
    }
}

function loginFailed(data) {
    console.log(data)
    swal("Oups", "Vos identifiants ne sont pas valides", "error")
}