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
    var counter = 0;
    var c = 0;
    $(".loading-page .counter h1").html(c + "%");
    $(".loading-page .counter hr").css("width", c + "%");
    $('#loadingAction').text("Envoie des modifications en attente");

    sendUpdate(counter, c)
}

function sendUpdate(counter, c) {
    updater.doUpdate(true).then(() =>{
        let toReach = 10;
        var i = setInterval(() => {
            if (counter == toReach) {
                $('#loadingAction').text("Récupération des permissions");
                clearInterval(i);
                apiPerms(counter, c)
            }else{
                counter++;
                c++;
                $(".loading-page .counter h1").html(c + "%");
                $(".loading-page .counter hr").css("width", c + "%");
            }
        })
    })
}

function apiPerms(counter, c) {

    apiHelper.getPerms().then(function () {

        let toReach = 20;
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

function apiUsers(counter, c) {
    apiHelper.getUsers().then((result) => {
        let toReach = 30;
        var i = setInterval(function () {

            counter++;
            c++;
            $(".loading-page .counter h1").html(c + "%");
            $(".loading-page .counter hr").css("width", c + "%");
            if (counter == toReach) {
                $('#loadingAction').text("Récupération des fournisseurs");
                clearInterval(i);
                apiSuppliers(counter, c)
            }
        }, 50)
    })
}

function apiSuppliers(counter, c) {
    apiHelper.getSuppliers().then((result) => {
        let toReach = 40;
        var i = setInterval(function () {

            counter++;
            c++;
            $(".loading-page .counter h1").html(c + "%");
            $(".loading-page .counter hr").css("width", c + "%");
            if (counter == toReach) {
                $('#loadingAction').text("Récupération des logs");
                clearInterval(i);
                apiLogs(counter, c)
            }
        }, 50)
    })
}

function apiLogs(counter, c) {
    apiHelper.getLogs().then(() => {
        let toReach = 50;
        var i = setInterval(function () {
            counter++;
            c++;
            $(".loading-page .counter h1").html(c + "%");
            $(".loading-page .counter hr").css("width", c + "%");
            if (counter == toReach) {
                clearInterval(i);
                displayLogin(counter, c)
            }
        })
    })
}

function displayLogin(counter, c) {
    loggerUICore.log('UICore Display login...')
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
                if (r) {
                    $('.loading-page').fadeOut(500)
                    $('.app-content').fadeIn(500)
                    main = $("#main")
                    $('#loggedName').html(user.usernameShopLogin)
                    $('#loggedNav').show()
                    leftBar.generateMenu()
                    $('#adminNav').show()
                    ejs.renderFile(adminPage, {}, {}, (err, str) => {
                        if (err) {
                            let __OBFID = "4dd6a707-7e86-411e-93d4-90530d794902"
                            errorHelper.log("Generating admin page when login oK", __OBFID, err)
                        } else {
                            $("#main").append(str)
                            switchView(null, VIEWS.admin, 500, 500)
                        }
                    })
                } else {
                    $('.loading-page').fadeOut(500)
                    $('.app-content').fadeIn(500)
                    main = $("#main")

                    ejs.renderFile(loginPage, {}, {}, (err, str) => {
                        if (err) {
                            console.log(err)
                        } else {
                            $("#main").append(str)
                        }
                    })
                }
            })
        }
    }, 50);


}

async function makeLogin() {

    var req = userHelper.getSession();
    let isLogged = false
    await req.then((r) => {
        if (r != false) {
            user = r
            isLogged = true
        } else {
            isLogged = false
        }
    }).catch((err) => {
        let __OBFID = "947152c1-00d7-4888-91e9-18ac3aa4b55c"
        errorHelper.log("Err makeLogin ", __OBFID, err)
        isLogged = false
    })
    return isLogged
}