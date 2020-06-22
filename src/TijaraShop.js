/**
 * @author: Romuald DETRAIT
 * @licence: closed Sources
 * @date: 23/04/2020
 * @description: Main js for TijaraShop App
 * @usage: app.ejs
 */

/**
 * IMPORTS
 */
const fs = require('fs')
const {ipcRenderer, remote, shell, webFrame, app} = require('electron') //Electron
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const path = require('path')
const $ = require('jquery')
const jQuery = require('jquery')
const jQueryUi = require('jquery-ui-dist/jquery-ui.js')
const chosen = require('chosen-js/chosen.jquery')
const resizable = require('jquery-resizable-dom/dist/jquery-resizable')
const swal = require('./assets/js/sweetalert2.min');


const configDir = (app || remote.app).getPath('userData');
const configFolder = configDir + "/config"
const errorFolder = configDir + "/error"
const errFile = localStorage.getItem('errFile')
var database = configFolder + "/database.db";
var List = require("collections/list");
var Map = require("collections/map");

var user;

var deleteList = new List();
var logList = new List();
var permsMap = new Map();
var usersMap = new Map();
var suppliersMap = new Map();

/**
 * HELPER SCRIPTS
 */

const config = require('./scripts/Helper/config.js')
var configObj;
const apiHelper = require('./scripts/Helper/apiHelper.js');
const errorHelper = require('./scripts/Helper/errorHelper.js')
const userHelper = require('./scripts/Helper/userHelper')
const dateUtils = require('./scripts/Helper/DateUtils')
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: database
    }
});
const mapManager = require('./scripts/Helper/mapManager')


var isDev = localStorage.getItem('dev') == "true";

/**
 * LOGGER
 */
const LoggerUtil = require('./scripts/Helper/loggerutil')
const loggerUICore = LoggerUtil('%c[UICore]', 'color: #000668; font-weight: bold')
const loggerAutoUpdater = LoggerUtil('%c[AutoUpdater]', 'color: #000668; font-weight: bold')
const loggerAutoUpdaterSuccess = LoggerUtil('%c[AutoUpdater]', 'color: #209b07; font-weight: bold')
const loggerLogin = LoggerUtil('%c[Login]', 'color: #000668; font-weight: bold')
const loggerInstall = LoggerUtil('%c[Install]', 'color: #000668; font-weight: bold')
const loggerUpdateThread = LoggerUtil('%c[UpdateThread]', 'color: #000668; font-weight: bold')

/**
 * PAGES
 */
const loginPage = path.join(__dirname, "vue", 'login.ejs')
const adminPage = path.join(__dirname, "vue", "admin.ejs")
const installPage = path.join(__dirname, "vue", "install.ejs")
const firstLoginPage = path.join(__dirname, "vue", "firstLogin.ejs")


/**
 * FRONT SCRIPTS
 */
const ui = require('./scripts/Front/ui');

/**
 * BACK SCRIPTS
 */
const setup = require('./scripts/Back/setup')
const updater = require('./scripts/Back/UpdateThread')
const leftBar = require('./scripts/Back/leftBar')


/**
 * MANAGERS
 */
const permsManager = require('./scripts/manager/permsManager')
const usersManager = require('./scripts/manager/usersManager')
const suppliersManager = require('./scripts/manager/suppliersManager')
const logsManager = require('./scripts/manager/logsManager')
const deleteManager = require('./scripts/manager/deleteManager')

/**
 * METHODS
 */
ui.initUi();

async function loadMaps() {
    await mapManager.loadLog().then(() => {
    })

    await permsManager.loadPerms()
    await usersManager.loadUsers()
    await mapManager.loadSuppliers().then(() => {
    })
}

loadMaps()
setup.initSetup();


