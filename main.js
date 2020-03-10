const {app, BrowserWindow, ipcMain} = require('electron')
const Menu = require('electron').Menu
const fs = require('fs')
const {localStorage, sessionStorage} = require('electron-browser-storage');

const {default: installExtension, REDUX_DEVTOOLS} = require('electron-devtools-installer')

const ejse = require('ejs-electron')
const path = require('path')
const url = require('url')
const isDev = require('./src/scripts/isDev')
const {autoUpdater} = require('electron-updater')


if (isDev) {
    console.log("Devmod enabled")
} else {
    console.log("You are not in dev mod")
}



// Reload index.html everytime the source files change

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 960,
        height: 552,
        minWidth: 720,
        minHeight: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        backgroundColor: '#171614'
    })

    ejse.data('bkid', Math.floor((Math.random() * fs.readdirSync(path.join(__dirname, 'src', 'assets')).length)))
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'app.ejs'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    /**mainWindow.webContents.openDevTools()**/

    /**
     * Can be switched to FULL SCREEN F11 with
     *  mainWindow.setFullScreen(true)
     * Menu can be hide by using
     * mainWindow.removeMenu()
     * Can be maximzed with
     * mainWindow.maximise()
     */
    mainWindow.maximize()

    mainWindow.on('closed', function () {
        mainWindow = null
        app.quit()
    })
    mainWindow.once('ready-to-show', () => {

    });
    if (!isDev) {
        mainWindow.webContents.on("devtools-opened", () => {
            mainWindow.webContents.closeDevTools();
        });
    }


}

app.on('ready', () => {
    createWindow()
    localStorage.clear()
    //if (!isDev) {
        autoUpdater.checkForUpdates().then(r => console.log(r)).catch(err => {
            console.log(err)
        })
   // }

})


// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()})
})


autoUpdater.on('update-available', () => {
    console.log("An update is available")
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    console.log("An update is downloaded")
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});