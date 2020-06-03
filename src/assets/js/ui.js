/*const $ = require('jquery')
const fs = require('fs')
const jQuery = require('jquery')
const jQueryUi = require('jquery-ui-dist/jquery-ui')
const {ipcRenderer, remote, shell, webFrame, app} = require('electron')
const LoggerUtil = require('./assets/js/loggerutil')
const loggerUICore = LoggerUtil('%c[UICore]', 'color: #000668; font-weight: bold')
const loggerAutoUpdater = LoggerUtil('%c[AutoUpdater]', 'color: #000668; font-weight: bold')
const loggerAutoUpdaterSuccess = LoggerUtil('%c[AutoUpdater]', 'color: #209b07; font-weight: bold')
const loggerLogin = LoggerUtil('%c[Login]', 'color: #000668; font-weight: bold')
const loggerInstall = LoggerUtil('%c[Install]', 'color: #000668; font-weight: bold')
const ejs = require('ejs')
const path = require('path')
const swal = require('./assets/js/sweetalert2.min.js')
var isDev = localStorage.getItem('dev') == "true";
const resizable = require('jquery-resizable-dom/dist/jquery-resizable')
const chosen = require('chosen-js/chosen.jquery')
var main;
const configDir = (app || remote.app).getPath('userData');
const configFolder = configDir + "/config"
const errorFolder = configDir + "/error"
const errFile = localStorage.getItem('errFile')
var database = configFolder + "/database.db";

const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: database
    }
});
const loginPage = path.join(__dirname, "vue", 'login.ejs')
const adminPage = path.join(__dirname, "vue", "admin.ejs")
const installPage = path.join(__dirname, "vue", "install.ejs")
const config = require('./scripts/config.js')
var configObj;
const apiHelper = require('./scripts/apiHelper.js');
const errorHelper = require('./scripts/errorHelper.js')
*/
/*
function initUI() {
    process.traceProcessWarnings = true
    process.traceDeprecation = true

    window.eval = global.eval = function () {
        throw new Error('Sorry, this app does not support window.eval().')
    }

    remote.getCurrentWebContents().on('devtools-opened', () => {
        console.log('%cAttention vous entrez dans la console.', 'color: white; -webkit-text-stroke: 4px #a02d2a; font-size: 60px; font-weight: bold')
        console.log('%cSi vous ne savez pas exactement ce que vous faites merci de fermer cette fenetre', 'font-size: 16px')
        console.log('%cSinon si vous savez ce que vous êtes en train de faire pourquoi ne pas travailler avec nous?', 'font-size: 16px')
    })


    webFrame.setZoomLevel(0)
    webFrame.setVisualZoomLevelLimits(1, 1)
    webFrame.setLayoutZoomLevelLimits(0, 0)

    document.addEventListener('readystatechange', function () {
        if (document.readyState === 'interactive') {
            loggerUICore.log('UICore Initializing..')

            //Bind close button
            Array.from(document.getElementsByClassName('fCb')).map((val) => {
                val.addEventListener('click', e => {
                    const window = remote.getCurrentWindow()
                    window.close()
                })
            })

            //Bind restore down button
            Array.from(document.getElementsByClassName('fRb')).map((val) => {
                val.addEventListener('click', e => {
                    const window = remote.getCurrentWindow();
                    if (window.isMaximized()) {
                        window.unmaximize()
                    } else {
                        window.maximize()
                    }
                    document.activeElement.blur()
                })
            })

            // Bind minimize button.
            Array.from(document.getElementsByClassName('fMb')).map((val) => {
                val.addEventListener('click', e => {
                    const window = remote.getCurrentWindow()
                    window.minimize()
                    document.activeElement.blur()
                })
            })
        }
    }, false)

    /**
     * Open web links in the user's default browser.
     */
 /*   $(document).on('click', 'a[href^="http"]', function (event) {
        event.preventDefault()
        shell.openExternal(this.href)
    })

    /**
     * Auto close Dev Tools if the devMode is disabled
     */
 /*   remote.getCurrentWindow().webContents.on("devtools-opened", () => {
        if (!isDev) {
            remote.getCurrentWindow().webContents.closeDevTools();
        }

    });
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
    displayLogin()

    loggerUICore.log('UICore Api getter...')
    //todo here we ll make our action to fill our database
    var counter = 0;
    var c = 0;
    $(".loading-page .counter h1").html(c + "%");
    $(".loading-page .counter hr").css("width", c + "%");
    $('#loadingAction').text("Récupération des permissions");

    /*var i = setInterval(function () {
        $(".loading-page .counter h1").html(c + "%");
        $(".loading-page .counter hr").css("width", c + "%");

        counter++;
        c++;

        if (counter == 101) {
            clearInterval(i);
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
    }, 50);*/
  //  apiPerms(counter, c)
//}
/*
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

            }
        }, 50)
    })
}

function displayLogin() {
    loggerUICore.log('UICore Display login...')
    //todo here we ll display login and hide updating

    if (localStorage.getItem('user')) {
        $('#loggedName').html(localStorage.getItem('user'))
        $('#loggedSubBox').html(localStorage.getItem('user') + "<small>" + localStorage.getItem('perms') + "</small>")
        $('#loggedNav').show()
        if (localStorage.getItem('perms') == 999) {
            $('#adminNav').show()
        }
    }
    if (localStorage.getItem('vue')) {
        var page = localStorage.getItem('vue')
        var obj = JSON.parse(page)
        $('.loading-page').hide()
        $('.app-content').show()
        ejs.renderFile(obj.page, {}, {}, (err, str) => {
            if (err) {
                console.log(err)
            } else {
                $("#main").append(str)
                $(obj.div).show()
            }
        })
    }

}


initUI()*/
