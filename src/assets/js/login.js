const loggerLogin = LoggerUtil('%c[Login]', 'color: #000668; font-weight: bold')

console.log(remote.getGlobal('ejse'))

$('#loginForm').submit(function (e) {
    e.preventDefault()
    switchView(getCurrentView(), VIEWS.admin, 500, 500)
})
