const loggerLogin = LoggerUtil('%c[Login]', 'color: #000668; font-weight: bold')


$('#loginForm').submit(function (e) {
    e.preventDefault()

    ejs.renderFile(adminPage, {}, {}, (err, str) => {
        if (err) {
            console.log(err)
        } else {
            switchView(getCurrentView(), VIEWS.admin, 500, 500)
            main.html(str)
        }
    })


})
