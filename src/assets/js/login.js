const loggerLogin = LoggerUtil('%c[Login]', 'color: #000668; font-weight: bold')

$('#loginForm').submit(function (e) {
    e.preventDefault()
    switchView(getCurrentView(), VIEWS.admin, 500, 500)
})
