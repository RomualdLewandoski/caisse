const {app, BrowserWindow, ipcMain} = require('electron')
const Menu = require('electron').Menu
const fs = require('fs')
const {localStorage, sessionStorage} = require('electron-browser-storage');
const {default: installExtension, REDUX_DEVTOOLS} = require('electron-devtools-installer')
const ejse = require('ejs-electron')
const path = require('path')
const url = require('url')
const isDev = require('./src/scripts/Helper/isDev')
const {autoUpdater} = require('electron-updater')

if (isDev) {
    console.log("Devmod enabled")
} else {
    console.log("You are not in dev mod")
}
let template = [
    {
        label: app.getName(), submenu: [
            {
                label: 'custom action 1', accelerator: 'CmdOrCtrl+R', click() {
                    console.log('go!')
                }
            },
            {
                label: 'custom action 2', accelerator: 'Shift+CmdOrCtrl+R', click() {
                    console.log('go!')
                }
            },
            {
                label: 'custom action 2', accelerator: 'Shift+CmdOrCtrl+I', click() {
                    mainWindow.webContents.openDevTools()
                }
            },
            {type: 'separator'},
            {role: 'quit'}
        ]
    }
]
const menu = Menu.buildFromTemplate(template)

/**
 * INIT FILES
 */
const configDir = (app || remote.app).getPath('userData');
const errorFolder = configDir + "/error"
const configFolder = configDir + "/config"
/**
 * CREATING CONFIG FOLDER IF NOT EXIST
 */
try {
    if (!fs.existsSync(configFolder)) {
        fs.mkdirSync(configFolder)
        console.log("Created config Folder")
    }
} catch (e) {
    console.error(e)
}
/**
 * CREATING ERROR FOLDER IF NOT EXIST
 */
try {
    if (!fs.existsSync(errorFolder)) {
        fs.mkdirSync(errorFolder)
        console.log("Created error Folder")
    }
} catch (e) {
    console.error(e)
}
var d = new Date();
const errFile = "error-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + "-" + (d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + "-" + d.getFullYear() + ".log";
const config = configFolder + "/config.json";
/**
 * CREATING CONFIG.JSON IF NOT EXIST
 */
fs.closeSync(fs.openSync(config, 'a'));
/**
 * CREATING DATABASE.DB IF NOT EXIST
 */
const database = configFolder + "/database.db";
fs.closeSync(fs.openSync(database, 'a'));
/**
 * END INIT FILES
 */
/**
 * START KNEX/SQLITE3
 */
var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: database
    },
    migrations: {
        tableName: 'knex_migrations'
    }
});
/**
 * CREATE OUR TABLES HERE
 */
const latestVersion = "20200611131715"
knex.migrate.currentVersion().then((r) => {
    let currentVersion = r;
    if (currentVersion < latestVersion) {
        knex.migrate.latest().then(value => {
            console.log("Database migrated to latestVersion " + latestVersion)
        })
    }else{
        console.log("Database already on latest version")
    }
})



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
    if (!isDev) {
        Menu.setApplicationMenu(menu)

    }

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
    if (!localStorage.getItem('dev')) {
        mainWindow.webContents.on("devtools-opened", () => {
            mainWindow.webContents.closeDevTools();
        });
    }


}

app.on('ready', () => {
    localStorage.clear()
    localStorage.setItem('dev', isDev);
    localStorage.setItem('errFile', errFile)
    createWindow()
    if (!isDev) {
        autoUpdater.checkForUpdates().then(r => console.log(r)).catch(err => {
            console.log(err)
        })
    }

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

