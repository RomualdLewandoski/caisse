const $ = require('jquery')

const {ipcRenderer, remote, shell, webFrame} = require('electron')
const LoggerUtil = require('./assets/js/loggerutil')
const loggerUICore = LoggerUtil('%c[UICore]', 'color: #000668; font-weight: bold')
const loggerAutoUpdater = LoggerUtil('%c[AutoUpdater]', 'color: #000668; font-weight: bold')
const loggerAutoUpdaterSuccess = LoggerUtil('%c[AutoUpdater]', 'color: #209b07; font-weight: bold')
const ejs = require('ejs')
const path = require('path')

const isDev = false;

var main;
var plop = "coucou"
const loginPage = path.join(__dirname, "vue", 'login.ejs')
const adminPage = path.join(__dirname, "vu", "admin.ejs")

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
$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault()
    shell.openExternal(this.href)
})

$(document).ready(function () {

    if (!isDev) {
        var counter = 0;
        var c = 0;
        var i = setInterval(function () {
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
                    console.log(str)
                    if (err) {
                        console.log(err)
                    } else {
                        $("#main").append(str)
                    }
                })
            }
        }, 50);

    } else {
        $('.loading-page').fadeOut(500)
        $('.app-content').fadeIn(500)
        main = $("#main")
        ejs.renderFile(loginPage, {}, {}, (err, str) => {
            console.log(str)
            if (err) {
                console.log(err)
            } else {
                $("#main").append(str)
            }
        })
    }


})
