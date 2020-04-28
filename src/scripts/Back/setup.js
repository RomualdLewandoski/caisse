module.exports.initSetup = function () {
    $(document).ready(function () {
        getConfig()
    })
}


function getConfig() {
    loggerUICore.log('UICore Config...')
    config.loadJson.then(function (value) {
        configObj = value;
        if (configObj == null) {
            displayInstall()
        } else {
            loadFromApi()
        }
    }).catch(function (err) {
        console.log(err);
        alert("Erreur interne lors de la récupération de la configuration")
    })
}

function displayInstall() {
    loggerUICore.log('UICore Installer...')
    //todo here we ll display our instll box for copying script
    $('.loading-page').fadeOut(500)
    $('.app-content').fadeIn(500)
    main = $("#main")
    ejs.renderFile(installPage, {}, {}, (err, str) => {
        if (err) {
            console.log(err)
        } else {
            $("#main").append(str)
        }
    })
}

function loadFromApi() {
    loggerUICore.log('UICore Api getter...')
    //todo here we ll make our action to fill our database
    var counter = 0;
    var c = 0;
    $(".loading-page .counter h1").html(c + "%");
    $(".loading-page .counter hr").css("width", c + "%");
    $('#loadingAction').text("Récupération des permissions");

    apiPerms(counter, c)
}

function apiPerms(counter, c) {

    apiHelper.getPerms().then(function () {

        let toReach = 10;
        var i = setInterval(function () {

            if (counter == toReach) {
                $('#loadingAction').text("Récupération des utilisateurs");
                clearInterval(i);
                apiUsers(counter, c)
            } else {
                counter++;
                c++;
                $(".loading-page .counter h1").html(c + "%");
                $(".loading-page .counter hr").css("width", c + "%");
            }
        }, 50)
    }).catch((error) => {
        console.error(error)
    })
}

async function apiUsers(counter, c) {
    apiHelper.getUsers().then((result) => {
        let toReach = 20;
        var i = setInterval(function () {

            counter++;
            c++;
            $(".loading-page .counter h1").html(c + "%");
            $(".loading-page .counter hr").css("width", c + "%");
            if (counter == toReach) {
                clearInterval(i);
                displayLogin(counter, c)
            }
        }, 50)
    })
}

function displayLogin(counter, c) {
    loggerUICore.log('UICore Display login...')
    //todo here we ll display login and hide updating
    var i = setInterval(async function () {
        $(".loading-page .counter h1").html(c + "%");
        $(".loading-page .counter hr").css("width", c + "%");

        counter++;
        c++;

        if (counter == 101) {
            clearInterval(i);
            updater.createTables();
            updater.updateLoop();
            await makeLogin().then((r) => {
                console.log(r)
                if (r) {
                    console.log(user)
                    $('.loading-page').fadeOut(500)
                    $('.app-content').fadeIn(500)
                    main = $("#main")
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
                } else {
                    $('.loading-page').fadeOut(500)
                    $('.app-content').fadeIn(500)
                    main = $("#main")
                    if (localStorage.getItem('vue')) {
                        var page = localStorage.getItem('vue')
                        var obj = JSON.parse(page)
                        ejs.renderFile(obj.page, {}, {}, (err, str) => {
                            if (err) {
                                console.log(err)
                            } else {
                                $("#main").append(str)
                                $(obj.div).show()
                            }
                        })
                    } else {
                        ejs.renderFile(loginPage, {}, {}, (err, str) => {
                            if (err) {
                                console.log(err)
                            } else {
                                $("#main").append(str)
                            }
                        })
                    }
                }
            })
        }
    }, 50);


}

async function makeLogin() {

    var req = userHelper.getSession();
    let isLogged = false
    await req.then((r) => {
        console.log(r)
        if (r != false) {
            user = r
            isLogged = true
        } else {
            isLogged = false
        }
    }).catch((err) => {
        errorHelper.log("Err makeLogin ", err)
        isLogged = false
    })
    return isLogged
}