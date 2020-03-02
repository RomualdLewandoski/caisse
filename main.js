const {app, BrowserWindow, ipcMain} = require('electron')
const Menu = require('electron').Menu
const fs                            = require('fs')

const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer')

const ejse = require('ejs-electron')
const path = require('path')
const url = require('url')


// Reload index.html everytime the source files change
const livereload = require('livereload').createServer()
livereload.watch(path.join(__dirname))
livereload.watch([
    __dirname + "/src/js",
    __dirname + "/src/css",
    __dirname + "/src"
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 552,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#171614'
  })

  ejse.data('bkid', Math.floor((Math.random() * fs.readdirSync(path.join(__dirname, 'src', 'assets', 'images', 'backgrounds')).length)))

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src', 'app.ejs'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  /** mainWindow.webContents.openDevTools() **/

  /**
   * Can be switched to FULL SCREEN F11 with
   *  mainWindow.setFullScreen(true)
   * Menu can be hide by using
   * mainWindow.removeMenu()
   * Can be maximzed with
   * mainWindow.maximise()
   */
  mainWindow.maximize()

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
